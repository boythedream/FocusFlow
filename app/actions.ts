"use server"; // Tell Next.js this file uses server actions

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"; // Auth helper
import { prisma } from "./utils/db"; // Prisma client for DB operations
import { revalidatePath } from "next/cache"; // Used to refresh cache after updates
import { getStripeSession, stripe } from "./utils/stripe"; // Stripe utils
import { redirect } from "next/navigation"; // Redirect helper

// Update user data (name and color)
export async function postData(FormData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // Update user info in DB
  await prisma.user.update({
    where: { id: user?.id },
    data: {
      name: FormData.get("name") as string,
      colorScheme: FormData.get("color") as string,
    },
  });

  // Revalidate the homepage layout after updating
  revalidatePath("/", "layout");
}

// Create a subscription for the user
export async function createSubscription() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    throw new Error("User not found"); // Guard: No user? Throw error
  }

  // Fetch user's Stripe customer ID
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { stripeCustomerId: true },
  });

  if (!dbUser?.stripeCustomerId) {
    throw new Error("No customer found"); // Guard: No Stripe customer? Throw error
  }

  // Check if subscription already exists
  const existingSubscription = await prisma.subscription.findUnique({
    where: { userId: user.id },
  });

  // If no subscription found, create one (default pending)
  if (!existingSubscription) {
    await prisma.subscription.create({
      data: {
        userId: user.id,
        stripeSubscriptionId: "pending", // Will be updated later by webhook
        interval: "month", // Default monthly
        status: "active", // Active for now
        planId: process.env.Stripe_Price_Id as string,
        currentPeriodStart: Math.floor(Date.now() / 1000), // Current time (in seconds)
        currentPeriodEnd: Math.floor((Date.now() + 30 * 24 * 60 * 60) / 1000), // 30 days later
      },
    });
  }

  // Get Stripe checkout URL
  const subscriptionUrl = await getStripeSession({
    customerId: dbUser.stripeCustomerId,
    domainUrl: "http://localhost:3000", // Replace with your production URL later
    priceId: process.env.Stripe_Price_Id as string,
  });

  // Redirect user to Stripe checkout
  return redirect(subscriptionUrl);
}

// Get subscription details for a user (internal use)
async function getSubscription(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId: userId },
    select: {
      status: true,
      user: {
        select: {
          stripeCustomerId: true,
        },
      },
    },
  });
  return subscription;
}

// Create a customer portal session for managing subscription
export async function createCustomerPortal() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // Get subscription and Stripe customer ID
  const data = await getSubscription(user?.id as string);

  // Create a billing portal session
  const session = await stripe.billingPortal.sessions.create({
    customer: data?.user?.stripeCustomerId as string,
    return_url: "http://localhost:3000/dashboard", // After managing subscription
  });

  // Redirect to billing portal
  return redirect(session.url);
}

// Create a new note
export async function postNotes(FormData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("User not found");
  }

  // Create new note in DB
  await prisma.note.create({
    data: {
      title: FormData.get("title") as string,
      description: FormData.get("description") as string,
      userId: user?.id as string,
    },
  });

  // Revalidate dashboard page to show new note
  revalidatePath("/dashboard");

  // Redirect back to dashboard
  return redirect("/dashboard");
}

// Update an existing note
export async function updateNote(FormData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("User not found");
  }

  const id = FormData.get("id") as string; // Note ID

  // Update note in DB
  await prisma.note.update({
    where: {
      id: id,
      userId: user?.id as string, // Ensure user owns the note
    },
    data: {
      title: FormData.get("title") as string,
      description: FormData.get("description") as string,
    },
  });

  // Revalidate dashboard page to show updated note
  revalidatePath("/dashboard");

  // Redirect back to dashboard
  return redirect("/dashboard");
}

// Delete a note
export async function deleteNote(FormData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("User not found");
  }

  const id = FormData.get("id") as string; // Note ID

  // Delete note from DB (only if it belongs to current user)
  await prisma.note.delete({
    where: {
      id: id,
      userId: user?.id as string,
    },
  });

  // Revalidate dashboard page to reflect deletion
  revalidatePath("/dashboard");

  // Redirect back to dashboard
  return redirect("/dashboard");
}

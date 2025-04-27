import { prisma } from "@/app/utils/db";
import { stripe } from "@/app/utils/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: unknown) {
    console.error("Webhook signature verification failed:", error);
    return new Response("Webhook error", { status: 400 });
  }

  console.log(`Received event of type: ${event.type}`);

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    if (!session.subscription) {
      return new Response("Subscription not found", { status: 404 });
    }

    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    const customerId = String(subscription.customer);
    const user = await prisma.user.findUnique({
      where: {
        stripeCustomerId: customerId,
      },
    });

    if (!user) {
      console.error(`User with stripeCustomerId ${customerId} not found`);
      return new Response("User not found", { status: 404 });
    }

    // Create the subscription record in the database
    await prisma.subscription.create({
      data: {
        stripeSubscriptionId: subscription.id,
        userId: user.id,
        currentPeriodStart: subscription.current_period_start, // Store as integer (Unix timestamp)
        currentPeriodEnd: subscription.current_period_end, // Store as integer (Unix timestamp)
        status: subscription.status,
        planId: subscription.items.data[0].plan.id,
        interval: subscription.items.data[0].plan.interval || "month", // Provide a default if undefined
      },
    });

    return new Response("Webhook handled successfully", { status: 200 });
  }

  // Handling other events like invoice payment succeeded or failed
  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId = invoice.subscription as string;

    // Retrieve the subscription and update its status or other details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const user = await prisma.user.findUnique({
      where: {
        stripeCustomerId: String(subscription.customer),
      },
    });

    if (!user) {
      console.error("User not found");
      return new Response("User not found", { status: 404 });
    }

    // Check if subscription exists before updating
    const existingSubscription = await prisma.subscription.findUnique({
      where: {
        stripeSubscriptionId: subscription.id,
      },
    });

    if (!existingSubscription) {
      console.error(`Subscription with ID ${subscription.id} not found`);
      return new Response("Subscription not found", { status: 404 });
    }

    await prisma.subscription.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        status: subscription.status,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
      },
    });

    return new Response("Invoice payment succeeded", { status: 200 });
  }

  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId = invoice.subscription as string;

    // Check if subscription exists before updating
    const existingSubscription = await prisma.subscription.findUnique({
      where: {
        stripeSubscriptionId: subscriptionId,
      },
    });

    if (!existingSubscription) {
      console.error(`Subscription with ID ${subscriptionId} not found`);
      return new Response("Subscription not found", { status: 404 });
    }

    await prisma.subscription.update({
      where: {
        stripeSubscriptionId: subscriptionId,
      },
      data: {
        status: "failed", // Update status to failed
      },
    });

    return new Response("Invoice payment failed", { status: 200 });
  }

  // Handle subscription cancellation
  if (event.type === "customer.subscription.deleted") {
    const canceledSubscription = event.data.object as Stripe.Subscription;

    await prisma.subscription.update({
      where: {
        stripeSubscriptionId: canceledSubscription.id,
      },
      data: {
        status: "canceled",
      },
    });

    return new Response("Subscription canceled", { status: 200 });
  }

  // If we don't recognize the event, return a 400 response
  return new Response("Event type not handled", { status: 400 });
}

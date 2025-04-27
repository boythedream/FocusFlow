import { createCustomerPortal, createSubscription } from "@/app/actions";
import LaunchButton from "@/app/components/LaunchButton";
import StartButton from "@/app/components/StartButton";
import { prisma } from "@/app/utils/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { CheckCircle, Flame } from "lucide-react";

const featuresItems = [
  {
    name: "Unlimited Notes",
    description: "Create and store as many notes as you need",
  },
  {
    name: "Cloud Sync",
    description: "Access your notes from any device, anytime",
  },
];

async function getSubscription(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: {
      userId: userId,
    },
    select: {
      status: true, // <-- add this
      user: {
        select: {
          stripeCustomerId: true,
        },
      },
    },
  });
  return subscription;
}
const Billing = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const subscription = await getSubscription(user?.id as string);
  if (subscription?.status === "active") {
    return (
      <div className="grid items-start gap-8">
        <div className="flex items-center justify-between px-2">
          <div className="grid gap-1">
            <h1 className="text-lg font-bold md:text-2xl"> Subscription</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your subscription and billing information.
            </p>
          </div>
        </div>
        <Card className="w-full lg:w-2/3">
          <CardHeader>
            <CardTitle>Edit Subscription</CardTitle>
            <CardDescription>
              Click the button below to manage your subscription. You can also
              cancel your subscription at any time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createCustomerPortal}>
              <LaunchButton>Manage Subscription</LaunchButton>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="max-w-sm mx-auto p-4">
      <Card className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-md border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 h-1.5" />

        <CardContent className="py-6 px-5">
          <div className="flex justify-between items-center mb-3">
            <h3 className="inline-flex items-center px-3 py-0.5 rounded-full bg-orange-500/10 text-xs font-semibold uppercase text-orange-600 dark:text-orange-400">
              Pro Plan
            </h3>
            <Flame className="h-4 w-4 text-orange-500" />
          </div>

          <div className="flex items-baseline text-4xl font-bold text-gray-900 dark:text-white">
            $9.99
            <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              /month
            </span>
          </div>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-snug">
            Unlock premium features for serious note-takers.
          </p>
        </CardContent>

        <div className="bg-gray-100 dark:bg-gray-800/60 px-5 pb-6 pt-3">
          <h4 className="font-medium text-gray-800 dark:text-gray-300 mb-2 text-sm">
            Features:
          </h4>

          <ul className="flex flex-col gap-3">
            {featuresItems.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md transition"
              >
                <CheckCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <form action={createSubscription} className="mt-4">
            <StartButton>Start Now</StartButton>
          </form>

          <p className="text-[10px] text-center text-gray-600 dark:text-gray-500 mt-3">
            7-day free trial, cancel anytime
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Billing;

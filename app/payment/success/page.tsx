"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const PaymentSuccess = () => {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center h-screen bg-green-50 dark:bg-green-900">
      <Card className="max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl">
        <CardHeader className="flex justify-center items-center pb-4">
          <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
        </CardHeader>
        <CardContent className="text-center">
          <h1 className="text-3xl font-semibold text-green-600 dark:text-green-400 mb-4">
            Payment Successful!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Thank you for your purchase. Your payment was successfully
            processed.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md transition-all duration-300 shadow-md"
          >
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;

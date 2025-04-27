"use client";

import React from "react";
import { XCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const PaymentCancel = () => {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center h-screen bg-red-50 dark:bg-red-900">
      <Card className="max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl">
        <CardHeader className="flex justify-center items-center pb-4">
          <XCircle className="h-16 w-16 text-red-600 dark:text-red-400" />
        </CardHeader>
        <CardContent className="text-center">
          <h1 className="text-3xl font-semibold text-red-600 dark:text-red-400 mb-4">
            Payment Canceled
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            It seems you have canceled the payment. If this was a mistake, you
            can try again.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-md transition-all duration-300 shadow-md"
          >
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancel;

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { User, Mail } from "lucide-react";
import React from "react";

import { prisma } from "@/app/utils/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { postData } from "@/app/actions";
import SubmitButton from "@/app/components/SubmitButton";

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      colorScheme: true,
    },
  });
  return data;
}

const Settings = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const data = await getData(user?.id as string);
  return (
    <div className="grid items-start gap-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Settings
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
      </div>
      <Card className="shadow-md">
        <form action={postData}>
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-2xl flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              General Data
            </CardTitle>
            <CardDescription className="text-sm mt-1">
              Please provide general information about yourself. Do not forget
              to save your changes.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Your Name
                  </span>
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your Name"
                  className="focus:ring-2 focus:ring-primary focus:ring-offset-1"
                  defaultValue={data && data.name ? data.name : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Your Email
                  </span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Your Email"
                  className="focus:ring-2 focus:ring-primary focus:ring-offset-1"
                  defaultValue={data?.email as string}
                  disabled
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4 pt-2 border-t mt-4">
            <SubmitButton>Save Changes</SubmitButton>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Settings;

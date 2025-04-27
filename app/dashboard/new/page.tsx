import { postNotes } from "@/app/actions";
import SubmitButton from "@/app/components/SubmitButton";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import Link from "next/link";
import React from "react";

const CreateNotes = () => {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="border shadow">
        <form action={postNotes}>
          <CardHeader className="space-y-2 border-b">
            <CardTitle className="text-2xl font-bold">
              Create New Note
            </CardTitle>
            <CardDescription>
              Capture your thoughts, ideas, and important information
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                required
                type="text"
                id="title"
                name="title"
                placeholder="Enter a title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                required
                id="description"
                name="description"
                placeholder="Enter description"
                rows={6}
                className="resize-none"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="destructive" type="button">
              <Link href="/dashboard" className="flex items-center">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Link>
            </Button>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateNotes;

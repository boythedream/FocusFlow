import { updateNote } from "@/app/actions";
import SubmitButton from "@/app/components/SubmitButton";
import { prisma } from "@/app/utils/db";
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
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { X } from "lucide-react";
import Link from "next/link";

async function getData({ userId, noteId }: { userId: string; noteId: string }) {
  const data = await prisma.note.findUnique({
    where: {
      id: noteId,
      userId: userId,
    },
    select: {
      title: true,
      description: true,
      id: true,
    },
  });
  return data;
}

const EditNotes = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const data = await getData({ userId: user?.id as string, noteId: id });

  return (
    <Card className="border shadow">
      <form action={updateNote}>
        <CardHeader className="space-y-2 border-b">
          <CardTitle className="text-2xl font-bold">Edit Note</CardTitle>
          <CardDescription>Edit your note and save it.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 pt-6">
          {/* Hidden input for the note ID */}
          <input type="hidden" name="id" value={data?.id} />

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              required
              type="text"
              id="title"
              name="title"
              placeholder="Enter a title"
              defaultValue={data?.title ? data.title : ""}
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
              defaultValue={data?.description ? data.description : ""}
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
  );
};

export default EditNotes;

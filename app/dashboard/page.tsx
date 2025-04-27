import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { prisma } from "../utils/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Edit, File, FilePlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DeleteNoteButton } from "../components/DeleteNoteButton";

async function getData(userId: string) {
  const data = await prisma.note.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return data;
}

const Dashboard = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData(user?.id as string);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="grid gap-1">
          <h1 className="text-2xl font-bold">Your Notes</h1>
          <p className="text-sm text-muted-foreground">
            Here a list of your notes.
          </p>
        </div>
        <Button>
          <FilePlus className="h-4 w-4 mr-2" />
          <Link href="/dashboard/new">Create a new Note</Link>
        </Button>
      </div>

      {data.length < 1 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
          <div className="flex flex-col items-center justify-center">
            <File className="mx-auto h-12 w-12 text-primary" />
          </div>

          <h2 className="mt-2 text-muted-foreground font-semibold text-lg">
            You do not have any notes
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Start creating notes to see your collection in here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          {data.map((note) => (
            <Card key={note.id} className="w-full p-4">
              <div className="flex justify-between items-center w-full">
                <div className="text-left">
                  <h2 className="font-semibold text-xl text-primary">
                    {note.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "full",
                    }).format(new Date(note.createdAt))}
                  </p>
                </div>
                <div className="flex gap-x-4 ml-4">
                  <Link href={`/dashboard/new/${note.id}`}>
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>

                  <DeleteNoteButton noteId={note.id} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

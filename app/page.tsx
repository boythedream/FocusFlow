import { Button } from "@/components/ui/button";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (user) {
    return redirect("/dashboard");
  }
  return (
    <section className="flex items-center justify-center bg-background h-[90vh]">
      <div className="relative items-center w-full px-5 py-12 mx-auto lg:px-16 md:px-12 sm:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div>
            <span className="w-auto px-6 py-3 rounded-full bg-secondary">
              <span className="text-sm font-medium text-primary">
                Sort your notes easily
              </span>
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight  sm:text-4xl">
              Create Notes with ease
            </h1>
            <p>
              <span className="mt-6 text-lg">
                Create, edit, and manage your notes with ease. Sort your notes
                easily and access them whenever you need them.
                <br />
              </span>
            </p>
          </div>
          <div className="mt-8 flex justify-center max-w-sm mx-auto">
            <RegisterLink>
              <Button size={"lg"} className="w-full">
                Sign up for free
              </Button>
            </RegisterLink>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import UserNav from "./UserNav";

const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <nav className="border-b bg-background h-[10vh] flex items-center justify-center">
      <div className="container flex items-center justify-between">
        <Link href={"/"}>
          <h1 className="font-bold text-3xl">
            Focus<span className="text-primary">Flow</span>
          </h1>
        </Link>
        <div className="flex items-center gap-x-5">
          <ThemeToggle />
          <div className="flex items-center gap-x-5">
            {user ? (
              <div className="flex items-center gap-x-3">
                <UserNav
                  name={user.given_name as string}
                  email={user.email as string}
                  image={user.picture as string}
                />
              </div>
            ) : (
              <div className="flex items-center gap-x-3">
                <LoginLink>
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </LoginLink>
                <RegisterLink>
                  <Button variant="outline" size="sm">
                    Register
                  </Button>
                </RegisterLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

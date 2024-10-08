"use client";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [redirect, setRedirect] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const user: User = session?.user as User;
  // Just a slight correction. It is Object destructuring with renaming. So data.user would also be fine if not renamed.
  const router = useRouter();

  useEffect(() => {
    if (redirect) {
      router.replace(`/sign-in`);
    }
  }, [signOut]);

  return (
    <nav className="p-4 md:p-6 shadow-md">
      <div className=" container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a className="text-xl font-bold mb-4 md:mb-0" href="#">
          Silent Sandesh
        </a>

        {session && status === "authenticated" ? (
          <>
            <span className="mr-4">Welcome, {user.username || user.email}</span>
            <div className=" space-x-5">
              <Link href={`/my-dashboard`}>
                <Button className="w-full md:w-auto">Dashboard</Button>
              </Link>
              <Button
                className="w-full md:w-auto"
                onClick={() => {
                  signOut();
                  setRedirect(true);
                }}
              >
                Logout
              </Button>
            </div>
          </>
        ) : (
          window.location.pathname.startsWith(`/u/`) && (
            <Link href={`/sign-in`}>
              <Button className="w-full md:w-auto">Login</Button>
            </Link>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar;

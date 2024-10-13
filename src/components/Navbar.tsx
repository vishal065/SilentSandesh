"use client";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { data: session, status } = useSession();
  // Just a slight correction. It is Object destructuring with renaming. So data.user would also be fine if not renamed.

  const user: User = session?.user as User;

  const router = useRouter();

  const [isClient, setIsClient] = useState(false);

  const { setTheme } = useTheme();

  useEffect(() => {
    setIsClient(true); // The component is now rendered in the browser

    if (!session && window?.location.pathname === `/my-dashboard`) {
      router.replace(`/sign-in`);
    }

    if (
      (session &&
        window?.location.pathname !== `/my-dashboard` &&
        !window?.location.pathname?.startsWith(`/u/`)) ||
      window?.location.pathname === `/sign-up` ||
      window?.location.pathname === `/sign-in`
    ) {
      router.replace(`/my-dashboard`);
    }
  }, [router, session]);

  return (
    <>
      {isClient && (
        <nav className="px-2 md:px-4  lg:px-6 py-6 shadow-md">
          <div className=" container mx-auto flex md:flex-row justify-between items-center">
            <Link className="text-xl font-bold mb-4 pt-2 md:mb-0" href="/">
              Silent Sandesh
            </Link>
            <div className=" container mx-auto flex md:flex-row justify-end items-center gap-2 md:gap-4">
              {session && status === "authenticated" ? (
                <>
                  <span className="mr-4 mb-3 mt-2">
                    Welcome, {user.username || user.email}
                  </span>
                  <div className="flex  space-x-5">
                    {window.location.pathname !== "/my-dashboard" && (
                      <Link href={`/my-dashboard`}>
                        <Button className="w-[75%] md:w-auto text-xs md:text-base font-medium md:font-normal">
                          Dashboard
                        </Button>
                      </Link>
                    )}
                    <Button
                      className="w-[75%] md:w-auto text-xs md:text-base font-medium md:font-normal"
                      onClick={async () => {
                        const data = await signOut({
                          redirect: false,
                          callbackUrl: "/",
                        });
                        router.push(data.url); // Redirect without page reload
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex  gap-1 md:gap-4 lg:gap-8">
                  <Link href={`/sign-up`}>
                    <Button className="w-[75%] md:w-auto text-xs md:text-base font-medium md:font-normal">
                      Signup
                    </Button>
                  </Link>
                  <Link href={`/sign-in`}>
                    <Button className="w-[75%] md:w-auto text-xs md:text-base font-medium md:font-normal">
                      Login
                    </Button>
                  </Link>
                </div>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;

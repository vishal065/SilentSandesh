"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { signInValidator } from "@/Validations/signInValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const signInForm = useForm<z.infer<typeof signInValidator>>({
    resolver: zodResolver(signInValidator),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof signInValidator>) => {
    setIsSubmitting(true);
    const response = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    console.log("response", response);
    if (response?.error) {
      setIsSubmitting(false);
      if (response.error === "CredentialsSignIn") {
        toast({
          title: "Login Failed",
          description: "Incorrect username or password",
          variant: "destructive",
        });
      } else {
        setIsSubmitting(false);
        toast({
          title: "Login Failed Error",
          description: response.error,
          variant: "destructive",
        });
      }
    }
    if (response?.url) {
      setIsSubmitting(false);
      router.replace(`/my-dashboard`);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 ">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 ">
            Join Silent Sandesh
          </h1>
          <p className="mb-4">Sign in to start your anonymous advanture</p>
        </div>
        <Form {...signInForm}>
          <form
            onSubmit={signInForm.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              name="identifier"
              control={signInForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Email/username" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={signInForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  please wait
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mb-4">
          <p>Don&apos;t have an Account?</p>
          <Link href={`/sign-up`} className="text-blue-500 hover:text-blue-800">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;

"use client";
import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { verifyCodeValidator } from "@/Validations/verifyCodeValidator";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

function Page() {
  const [isSubmiting, setIsSubmitting] = useState(false);
  const params = useParams<{ username: string }>();
  const router = useRouter();

  const verify = useForm<z.infer<typeof verifyCodeValidator>>({
    resolver: zodResolver(verifyCodeValidator),
  });

  const onSubmit = async (data: z.infer<typeof verifyCodeValidator>) => {
    setIsSubmitting(true);
    try {
      console.log("before req");
      console.log("username", params.username, "data", data.code);

      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        verifyCode: data.code,
      });
      console.log("after req", response);

      toast({
        title: "success",
        description: response.data.message,
        variant: "default",
      });
      router.replace(`/sign-in`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "failed",
        description: axiosError.response?.data.message,
        variant: "default",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 text-black">
      <div className="w-full max-w-md p-8 space-y-8 bg-white/80 rounded-lg shadow-md">
        <div className="text-center"></div>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 ">
          Verify your Account
        </h1>
        <p className="mb-4">Enter the verification code sent your email</p>
        <Form {...verify}>
          <form onSubmit={verify.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              name="code"
              control={verify.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verify code</FormLabel>
                  <FormControl>
                    <Input placeholder="code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <Button type="submit" disabled={isSubmiting}>
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Page;

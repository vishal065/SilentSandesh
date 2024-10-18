"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import questions from "@/Data/suggestMessage";

const Page = () => {
  const { username } = useParams<{ username: string }>();
  const [loadingSuggestMessage, setLoadingSuggestMessage] = useState(false);
  // const [Chunk, setChunk] = useState<string>("");
  const [suggestedMessage, setSuggestedMessage] = useState<string[]>([]);
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
    //    reset,
  } = useForm();

  const content = watch("message");

  function getRandomQuestions(questions: string[]) {
    const shuffled = questions.sort(() => 0.5 - Math.random()); // Shuffle the array
    return shuffled.slice(0, 3); // Return the first 'count' items
  }

  const suggestMessage = async () => {
    setLoadingSuggestMessage(true);
    setSuggestedMessage([]);
    // setChunk("");
    // try {
    //   const response = await fetch("/api/suggest-message", {
    //     method: "POST",
    //   });
    //   if (!response.body) {
    //     throw new Error(
    //       "ReadableStream is not supported by the browser or the response body is null."
    //     );
    //   }
    //   const reader = response?.body.getReader();

    //   const decoder = new TextDecoder();

    //   let done = false;

    //   while (!done) {
    //     const { value, done: doneReading } = await reader.read();
    //     done = doneReading;

    //     const chunk = decoder.decode(value, { stream: true });
    //     setChunk((prev) => prev + chunk);

    //     setSuggestedMessage(Chunk?.split("||"));
    //     console.log(suggestedMessage);
    //   }
    // } catch (error) {
    // } finally {
    //   setLoadingSuggestMessage(false);
    // }
    try {
      const response = await fetch("/api/suggest-message", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("data", data);

      setSuggestedMessage(data.data.split("||"));
    } catch (error) {
    } finally {
      setLoadingSuggestMessage(false);
    }
  };

  const SendMessage = async () => {
    const data = { username, content };

    try {
      const response = await fetch(`/api/send-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const resp = (await response.json()) as ApiResponse;

      resp.success === true
        ? toast({
            title: "Send",
            description: resp.message || "Message send succesfully",
          })
        : toast({
            title: "Failed",
            description: resp.message,
            variant: "destructive",
          });
    } catch (error) {
      toast({
        title: "Failed",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setValue("message", "");
    }
  };

  useEffect(() => {
    setLoadingSuggestMessage(true);
    setSuggestedMessage(getRandomQuestions(questions));
    setLoadingSuggestMessage(false);
  }, []);

  return (
    <div className="flex flex-col items-start justify-center mt-10 lg:mx-auto p-4 md:p-6  w-full max-w-6xl text-xs sm:text-sm md:text-base">
      <h1 className="text-xl lg:text-4xl font-extrabold mb-6 place-self-center  ">
        Public Profile Link
      </h1>
      <div className=" font-semibold tracking-tight w-full">
        <div className="flex flex-col w-full items-center justify-center space-y-4 mx-auto sm:p-8 md:p-10 lg:p-16 ">
          <p className="place-self-start ">
            Send Anonymous Message to @{username}
          </p>
          <form
            onSubmit={handleSubmit(SendMessage)}
            className="flex flex-col w-full justify-center"
          >
            <input
              type="text"
              {...register("message", {
                required: "message is required",
                minLength: {
                  value: 5,
                  message: "message must be at least 5 characters",
                },
                maxLength: {
                  value: 100,
                  message: "message must be less then 100 characters",
                },
              })}
              className="input border-2  input-bordered place-self-start  pt-3 px-3 pb-20 w-full rounded-xl text-left align-text-top "
              placeholder="Write your anonymous message here"
            />
            {errors.message?.message && <p>{String(errors.message.message)}</p>}
            <Button
              className="mt-2 w-16 sm:w-20 lg:w-32  lg:text-lg place-self-center"
              type="submit"
            >
              Send
            </Button>
          </form>
        </div>
        <div className="p-4  space-y-4">
          <Button
            className="w-24 md:w-28 lg:w-32 xl:w-36  text-xs  lg:text-base px-4 font-light md:font-medium"
            onClick={suggestMessage}
          >
            Suggest Message
          </Button>
          <Separator />
          <p className="ml-4">Click on any message below to select it.</p>
          <div className="p-4 md:m-2 font-bold border rounded-md ">
            <h2 className="ml-4 font-semibold text-xl">Messages</h2>
            <div className=" p-2 sm:p-4 space-y-4">
              {loadingSuggestMessage ? (
                <div className="flex flex-col w-full justify-center items-center space-y-2">
                  <div className="flex flex-col w-full h-12 border items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin " />
                  </div>
                  <div className="flex flex-col w-full h-12 border items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin " />
                  </div>
                  <div className="flex flex-col  w-full h-12 border items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin " />
                  </div>
                </div>
              ) : (
                suggestedMessage?.map((data, i) => (
                  <p
                    key={i}
                    onClick={() => setValue("message", data)}
                    className="border p-3 text-center rounded-md"
                  >
                    {data}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ApiResponse } from "@/types/ApiResponse";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const Page = () => {
  const { username } = useParams<{ username: string }>();
  const [suggestedMessage, setSuggestedMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const suggestMessage = async () => {
    setLoading(true);
    try {
      const response = await axios.get<ApiResponse>(`/api/suggest-message`);
      console.log("response",response);
      // console.log("response data", response.data);

      setSuggestedMessage(response?.data.suggestedMessage as string);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  // console.log(suggestMessage);

  return (
    <div className="flex flex-col items-start justify-center mt-10 lg:mx-auto p-6  w-full max-w-6xl">
      <h1 className="text-xl lg:text-4xl font-extrabold mb-6 place-self-center  ">
        Public Profile Link
      </h1>
      <div className="text-base font-semibold tracking-tight w-full">
        <div className="flex flex-col w-full items-center justify-center space-y-4 mx-auto p-16 ">
          <p className="place-self-start ">
            Send Anonymous Message to @{username}
          </p>
          <input
            type="text"
            className="input border-2  input-bordered place-self-start  pt-3 px-3 pb-20 w-full rounded-xl text-left align-text-top"
            placeholder="Write your anonymous message here"
            maxLength={100}
          />
          <Button className="mt-2" type="submit">
            Send
          </Button>
        </div>
        <div className="p-4 ml-10 space-y-4">
          <Button onClick={() => suggestMessage()}>Suggest Message</Button>
          <Separator />
          <p>Click on any message below to select it.</p>
          <div className="p-4 m-2 font-bold border rounded-md ">
            <h2 className="ml-4 font-semibold text-xl">Messages</h2>
            <div className=" p-4 space-y-4">
              <p className="border p-3 text-center rounded-md">
                hello this is data
              </p>
              <p className="border p-3 text-center rounded-md">
                hello this is data
              </p>
              <p className="border p-3 text-center rounded-md">
                hello this is data
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

"use client";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import messageServices from "@/services/messagesServices";
import { ApiResponse, Message } from "@/types/ApiResponse";
import { acceptMessageValidator } from "@/Validations/acceptMessageValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [Loading, setLoading] = useState(false);
  const router = useRouter();
  const [baseURL, setBaseURL] = useState("");

  const { data: session } = useSession();

  // Just a slight correction. It is Object destructuring with renaming. So data.user would also be fine if not renamed.
  const { username } = (session?.user as User) || {};

  const form = useForm({ resolver: zodResolver(acceptMessageValidator) });
  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  // -------------- delete messages -------------------

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages?.filter((message) => message._id !== messageId));
  };

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await messageServices.isAcceptMessages();
      setValue("acceptMessages", Boolean(response?.data.data));
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to change state",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  // -------------- get all messages ----------------

  const fetchMessages = useCallback(
    async (refesh: boolean = false) => {
      setLoading(true);
      setIsSwitchLoading(true);
      try {
        const response = await messageServices.getAllMessages();
        setMessages(response.data?.messages as Message[]);
        if (refesh) {
          toast({
            title: "Refreshed Messages",
            description: "latest message updated",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;

        toast({
          title: "Error",
          description:
            axiosError.response?.data.message ?? "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setMessages]
  );

  // -------------- user switch accepting messages ----------------

  const handleSwitchChange = async () => {
    try {
      const response = await messageServices.switchAcceptMessages({
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({ title: response.data?.message, variant: "default" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    }
  };

  // ----------- copy unique link -----------

  const ProfileUrl = `${baseURL}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ProfileUrl);
    toast({
      title: "URL copied",
      description: "Profile URL has been copied to clipboard",
    });
  };

  // -------------- useeffect ----------------

  useEffect(() => {
    if (!session || !session.user) {
      return;
    }

    fetchMessages();
    fetchAcceptMessage();

    setBaseURL(`${window.location.protocol}//${window.location.host}`);
  }, [session, fetchAcceptMessage, fetchMessages, router]);

  if (!session || !session.user) {
    return <div>Please login</div>;
  }

  return (
    <div className="my-8 mx-2 sm:mx-3  md:mx-8 lg:mx-auto px-4 md:p-6 bg-white/80 rounded w-full max-w-6xl text-black">
      <h1 className="text-4xl font-bold mb-2">User Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={ProfileUrl}
            disabled
            className="input input-bordered outline w-full p-2 mr-2  text-xs md:text-base"
          />
          <Button
            className="mx-2 text-sm md:text-base"
            onClick={copyToClipboard}
          >
            Copy
          </Button>
        </div>
      </div>
      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={(checked) => {
            setValue("acceptMessages", checked); // manually set value on change
            handleSwitchChange(); // call your switch handler
          }}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />
      <Button
        className="my-4 text-white  "
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages();
        }}
      >
        {Loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <main className="flex-grow container mx-auto p-4">
        <h2 className="text-3xl font-bold mb-6">All Messages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(messages?.length as number) > 0 ? (
            messages?.map((message, i) => (
              <MessageCard
                key={i}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p className="">No message to display.</p>
          )}
        </div>
      </main>
    </div>
  );
};
export default Page;

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { ApiResponse, Message } from "@/types/ApiResponse";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDelete = async () => {
    const response = await axios.delete<ApiResponse>(
      `/api/delete-message/${message?._id}`
    );
    toast({ title: response.data.message });
    onMessageDelete(message?._id as string);
  };
  const date = new Date(message?.createdAt);
 const readableDateIST = date.toLocaleString("en-IN", {
   year: "2-digit",
   month: "short",
   day: "numeric",
   hour: "numeric",
   minute: "numeric",
 });
  
  return (
    <Card className="border pl-2 pr-4 pb-4 pt-2 -ml-4 w-full rounded-lg relative">
      <CardHeader>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="w-11 h-9 md:w-12 md:h-10 right-6 place-self-end absolute top-4 mx-auto "
              variant="destructive"
            >
              <X className="w-8 h-8" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent>
        <p className="font-semibold text-wrap leading-tight">
          {message.content}
        </p>
      </CardContent>
      <CardFooter className="absolute bottom-2 right-2 p-1 justify-end items-end text-xs md:text-sm ">
        {readableDateIST}
      </CardFooter>
    </Card>
  );
};

export default MessageCard;

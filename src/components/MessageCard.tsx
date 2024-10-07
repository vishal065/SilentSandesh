import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <Card className="border p-5 w-full rounded-lg relative">
      <CardHeader className="">
        <CardTitle className="text-wrap">{message.content}</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="w-12 h-10 place-self-end absolute top-4 mx-auto "
              variant="destructive"
            >
              <X className="w-7 h-7" />
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
      <CardContent></CardContent>
    </Card>
  );
};

export default MessageCard;

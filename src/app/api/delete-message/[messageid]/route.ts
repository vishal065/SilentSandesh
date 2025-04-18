import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import apiResponse from "@/helpers/apiResponse";
import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import apiError from "@/helpers/ApiError";

export async function DELETE(
  req: Request,
  { params }: { params: { messageid: string } }
) {
  dbConnect();
  const messageID = params.messageid;
  const session = await getServerSession(authOptions);
  const user = session?.user as User;
  if (!session || !user) {
    return apiResponse(false, "Not Authenticated", 400);
  }
  try {
    const DeletedMessage = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageID } } }
    );
    if (DeletedMessage.modifiedCount === 0) {
      return apiResponse(false, "Failed to delete message", 400);
    }
    return apiResponse(true, "Deleted message successfully", 200);
  } catch (error) {
    console.error(error);

    apiError(false, "Failed to delete message", 500);
  }
}

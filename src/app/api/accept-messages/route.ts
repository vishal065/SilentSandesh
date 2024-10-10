import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";
import UserModel from "@/model/User.model";
import apiResponse from "@/helpers/apiResponse";
import apiError from "@/helpers/ApiError";

export async function POST(request: Request) {
  dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !user) {
    return Response.json(
      { success: false, message: "Error verifying user" },
      { status: 400 }
    );
  }

  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      {
        isAcceptingMessages: acceptMessages,
      },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "failed to update the user status to accept messages",
        },
        { status: 401 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Message acceptance status changed successfully !!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("faild to update user status to accept message");
    return Response.json(
      {
        success: false,
        message: "faild to update user status to accept message",
      },
      { status: 500 }
    );
  }

  //  try {
  //    const dbUser = await UserModel.findOne({ _id: user._id });
  //    if (!dbUser) {
  //      return Response.json(
  //        { success: false, message: "User not found" },
  //        { status: 400 }
  //      );
  //    }
  //    dbUser.isAcceptingMessages = !dbUser.isAcceptingMessages;
  //    await dbUser.save();
  //  } catch (error) {
  //    return Response.json(
  //      { success: false, message: "failed to update status" },
  //      { status: 500 }
  //    );
  //  }
}

export const GET = async () => {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return apiError(false, "Not authenticated !!", 401);
  }

  const userID = user?._id || "";
  try {
    const user = await UserModel.findById(userID);
    if (!user) {
      return apiError(false, "User not found", 404);
    }
    return apiResponse(
      true,
      "User recieved messages !!",
      200,
      user?.isAcceptingMessages
    );
  } catch (err: unknown) {
    console.log("user not received messages !!");
    return apiError(false, "something went wrong", 400);
  }
};

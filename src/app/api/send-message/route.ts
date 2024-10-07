import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { Message } from "@/types/ApiResponse";

export async function POST(req: Request) {
  await dbConnect();
  const { username, content } = await req.json();
  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        { success: false, message: "No such user exist" },
        { status: 404 }
      );
    }
    if (!user.isVerified) {
      return Response.json(
        { success: false, message: "Not Verified User" },
        { status: 404 }
      );
    }

    if (user.isAcceptingMessages === false) {
      return Response.json(
        { success: false, message: "user is not accepting messages" },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();
    return Response.json(
      { success: true, message: "message send successfully" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "failed to send message" },
      { status: 500 }
    );
  }
}

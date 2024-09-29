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
        { success: false, message: "failed to get user" },
        { status: 404 }
      );
    }
    if (user.isAcceptingMessage === false) {
      return Response.json(
        { success: true, message: "user is not accepting messages" },
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

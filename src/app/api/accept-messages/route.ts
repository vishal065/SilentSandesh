import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";
import UserModel from "@/model/User.model";

export async function POST() {
  dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !user) {
    return Response.json(
      { success: false, message: "Error verifying user" },
      { status: 400 }
    );
  }

  try {
    const dbUser = await UserModel.findOne({ _id: user._id });
    if (!dbUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 400 }
      );
    }
    dbUser.isAcceptingMessage = !dbUser.isAcceptingMessage;
    await dbUser.save();
  } catch (error) {
    return Response.json(
      { success: false, message: "failed to update status" },
      { status: 500 }
    );
  }
}

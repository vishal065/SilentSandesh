import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User.model";
import mongoose from "mongoose";

export async function GET() {
  dbConnect();
  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !user) {
      return Response.json(
        { success: false, message: "Error verifying user" },
        { status: 400 }
      );
    }

    const UserId = new mongoose.Types.ObjectId(user._id);

    const dbUser = await UserModel.aggregate([
      { $match: { _id: UserId } },
      {
        $project: {
          _id: 1,
          messages: { $ifNull: ["$messages", []] }, // Ensures messages is an array
        },
      },
      { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
      {
        $project: {
          _id: UserId,
          messages: {
            $cond: {
              if: { $eq: [{ $size: "$messages" }, 0] },
              then: [],
              else: "$messages",
            },
          },
        },
      },
    ]);

    if (!dbUser || dbUser.length === 0) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 400 }
      );
    }

    return Response.json(
      { success: true, messages: dbUser[0]?.messages },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "failed to update status" },
      { status: 500 }
    );
  }
}

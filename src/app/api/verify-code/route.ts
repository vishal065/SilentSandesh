import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { verifyCode, username } = await req.json();

    //url se jo chize ati h unko decord krne k liye like space converted in %20
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 400 });
    }

    const isCodeValid = user.verifyCode === verifyCode;
    const isCodeNotExpire = new Date(user.verifyCodeExpire) > new Date();

    if (isCodeValid && isCodeNotExpire) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "Account verified successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message: "invalid verification code",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Verification code expire",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    return Response.json(
      { message: "Error while verifiying user", success: false },
      { status: 500 }
    );
  }
}

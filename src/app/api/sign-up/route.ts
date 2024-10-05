import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcrypt";
// import { ApiResponse } from "@/types/ApiResponse";
// import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await req.json();
    const existingUserVerifiedByUsername = await UserModel.find({
      username,
      isVerified: true,
    });
    console.log(existingUserVerifiedByUsername);

    if (
      existingUserVerifiedByUsername &&
      existingUserVerifiedByUsername.length > 0
    ) {
      return Response.json({
        status: 400,
        success: false,
        message: "Username already taken",
      });
    }

    const existingUserByEmail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expireDate = new Date();
    expireDate.setHours(expireDate.getHours() + 1);

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json({
          status: 400,
          success: false,
          message: "user already exist with this email",
        });
      } else {
        const hashPassword = bcrypt.hashSync(password, 10);
        existingUserByEmail.password = hashPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpire = expireDate;
        // existingUserByEmail.verifyCodeExpire = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashPassword = bcrypt.hashSync(password, 10);

      const newUser = new UserModel({
        username,
        email,
        password: hashPassword,
        verifyCode,
        verifyCodeExpire: expireDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });
      await newUser.save();
    }
    //send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    console.log(emailResponse);
    
    if (!emailResponse.success) {
      return Response.json({
        status: 500,
        success: false,
        message: emailResponse.message,
      });
    }
    return Response.json({
      status: 201,
      success: true,
      message: "user registered successfully. please verify your email",
    });
  } catch (error) {
    console.error("failed to Register user", error);
    return Response.json({
      status: 500,
      success: false,
      message: "failed to register User",
    });
  }
}

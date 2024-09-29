import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { UsernameSchema } from "@/Validations/signupValidator";
import { z } from "zod";

const UsernameValidator = z.object({
  username: UsernameSchema,
});

export async function GET(req: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    // const queryParams2 = searchParams.get("username"); //this one cannot validate
    const queryParams = { username: searchParams.get("username") }; //sir did in this way

    const result = UsernameValidator.safeParse(queryParams);

    console.log("searchParams", searchParams);
    console.log("queryParams", queryParams);
    // console.log("queryParams 2", queryParams2);

    if (!result.success) {
      //   return Response.json({ message: "invalid Username" }, { status: 400 });
      const usernameError = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameError?.length > 0
              ? usernameError.join(", ")
              : "invalid query parameters",
        },
        { status: 400 }
      );
    }

    const existingVerifiedUser = await UserModel.findOne({
      username: queryParams.username,
      isVerified: true,
    });

    console.log(existingVerifiedUser);

    if (existingVerifiedUser) {
      return Response.json(
        { message: "User Already already taken choose another" },
        { status: 400 }
      );
    }

    return Response.json(
      { success: true, message: "Username is available" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        messaege: "Error Checking Username",
      },
      { status: 500 }
    );
  }
}

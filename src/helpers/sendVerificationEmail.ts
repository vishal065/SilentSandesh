import { resend } from "@/lib/resend";
import VerificationEmail from "@/templates/VerificationEmail-resend";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    console.log("api key", process.env.RESEND_API_KEY);

    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email.trim(),
      subject: "Silent Sandesh || Verification Code ",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    console.log("send mail ", response);

    return { success: false, message: "failed to send mail" };
  } catch (error) {
    console.log("Error in sending mail", error);
    return { success: false, message: "error in sending mail" };
  }
}

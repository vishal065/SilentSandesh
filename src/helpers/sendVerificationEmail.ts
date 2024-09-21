import { resend } from "@/lib/resend";
import VerificationEmail from "@/templates/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Silent Sandesh || Verification Code ",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return { success: false, message: "failed to send mail" };
  } catch (error) {
    console.log("Error in sending mail", error);
    return { success: false, message: "failed to send mail" };
  }
}

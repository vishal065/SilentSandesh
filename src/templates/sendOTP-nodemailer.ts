import mailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

type templateProp = {
  url: string;
  userName: string;
  title: string;
  OTP: string;
  hour: number;
};

export async function SendMailTemplate(email: string, template: templateProp) {
  try {
    const mailtransporter = mailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.AUTH_MAIL,
        pass: process.env.AUTH_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Recreate __dirname behavior in ES module
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const templatePath = path.join(__dirname, template.url); //(__dirname,"inner folder if any", template.url);

    const templatefile = fs.readFileSync(templatePath, "utf-8");

    const html = ejs.render(templatefile, template);

    const malingdetail = {
      from: process.env.AUTH_MAIL,
      to: email,
      subject: " Verification Code ",
      html,
    };

    const resp = await mailtransporter.sendMail(malingdetail);
    return resp;
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

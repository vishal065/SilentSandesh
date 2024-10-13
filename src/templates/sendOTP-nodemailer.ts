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
    console.log("__filename is ", __filename);

    const __dirname = path.dirname(__filename);
    console.log("__dirname is ", __dirname);

    const templatePath = path.join(__dirname, template.url); //(__dirname,"inner folder if any", template.url);
    console.log("template object", template);
    console.log("templatePath is ", templatePath);

    const templatefile = fs.readFileSync(templatePath, "utf-8");
    console.log("templatefile is ", templatefile);

    const html = ejs.render(templatefile, template);
    console.log("html is ", html);

    const mailingdetail = {
      from: process.env.AUTH_MAIL,
      to: email,
      subject: " Verification Code ",
      html,
    };
    console.log("mailingdetail is ", mailingdetail);

    const resp = await mailtransporter.sendMail(mailingdetail);
    console.log("resp is ", resp);

    return resp;
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

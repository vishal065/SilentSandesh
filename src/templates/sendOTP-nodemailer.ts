import mailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import fs from "fs";
// import { fileURLToPath } from "url";

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
      secure: false,
      auth: {
        user: process.env.AUTH_MAIL,
        pass: process.env.AUTH_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Recreate __dirname behavior in ES module
    // const __filename = fileURLToPath(import.meta.url);

    // const __dirname = path.dirname(__filename);

    //! Note templatePath is not working in production;
    // const templatePath = path.join(__dirname, "src", "templates", template.url); //(__dirname,"inner folder if any", template.url);

    const absoulutePath = path.join(
      process.cwd(),
      "src",
      "templates",
      "sendOTP-nodemailer.ejs"
    );
    console.log("absoulte path ", absoulutePath);

    const templatefile = fs.readFileSync(absoulutePath, "utf-8");

    const html = ejs.render(templatefile, template);

    const mailingdetail = {
      from: process.env.AUTH_MAIL,
      to: email,
      subject: "Verification Code",
      html,
    };

    const resp = await mailtransporter.sendMail(mailingdetail);
    console.log("resp is ", resp);

    return resp;
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

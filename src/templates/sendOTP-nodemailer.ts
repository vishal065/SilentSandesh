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
    console.log("process.env.AUTH_MAIL ", process.env.AUTH_MAIL);
    console.log("process.env.AUTH_MAIL ", typeof process.env.AUTH_MAIL);
    console.log("process.env.AUTH_PASS ", process.env.AUTH_PASS);
    console.log("process.env.AUTH_PASS ", typeof process.env.AUTH_PASS);
    const AUTH_MAIL = process.env.AUTH_MAIL;
    const AUTH_PASS = process.env.AUTH_PASS;
    console.log("process.env.AUTH_PASS ", AUTH_MAIL);
    console.log("process.env.AUTH_PASS ", typeof AUTH_MAIL);
    console.log("process.env.AUTH_PASS ", AUTH_PASS);
    console.log("process.env.AUTH_PASS ", typeof AUTH_PASS);

    const mailtransporter = mailer.createTransport({
      service: "gmail",
      secure: false,
      auth: {
        user: AUTH_MAIL,
        pass: AUTH_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      debug: true,
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

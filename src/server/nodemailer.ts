import nodemailer from "nodemailer";
import { env } from "~/env";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "teddybearlaughs@gmail.com",
    pass: process.env.NODEMAILER_GMAIL_PASS,
  },
});

type EmailType = "verification" | "password-reset";

export const sendMailRequest = async (
  email: string,
  token: string,
  type: EmailType,
) => {
  const verificationLink = `http://localhost:3000/auth/verify-email?token=${token}`;
  const passwordResetLink = `http://localhost:3000/auth/new-password?token=${token}`;
  try {
    let mailOptions = {};
    switch (type) {
      case "verification":
        mailOptions = {
          from: "Landscape <teddybearlaughs@gmail.com>",
          to: email,
          subject: "Landscape: Confirm your email address ✉",
          html:
            '<p>To complete registration, verify your email by clicking the link below:</p>\
             <p><a href="' +
            verificationLink +
            '"><b>Verify Email</b></a></p>',
        };

        break;
      case "password-reset":
        mailOptions = {
          from: "Landscape <teddybearlaughs@gmail.com>",
          to: email,
          subject: "Landscape: Reset your password ✉",
          html:
            '<p>To reset your password, click the link below:</p>\
             <p><a href="' +
            passwordResetLink +
            '"><b>Reset Password</b></a></p>',
        };
        break;
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("error sendig mail", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.log("sending mail error", { error });
  }
};

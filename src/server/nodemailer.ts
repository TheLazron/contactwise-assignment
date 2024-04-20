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

await new Promise((resolve, reject) => {
  // verify connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
      reject(error);
    } else {
      console.log("Server is ready to take our messages");
      resolve(success);
    }
  });
});

export const sendMailRequest = async (
  email: string,
  token: string,
  type: EmailType,
) => {
  const verificationLink = `https://landscp.netlify.app/auth/verify-email?token=${token}`;
  const passwordResetLink = `https://landscp.netlify.app/auth/new-password?token=${token}`;

  await new Promise((resolve, reject) => {
    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("Server is ready to take our messages");
        resolve(success);
      }
    });
  });

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
  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("error sending mail", error);
        reject(error);
      } else {
        console.log("Email sent: " + info.response);
        resolve(info);
      }
    });
  });
};

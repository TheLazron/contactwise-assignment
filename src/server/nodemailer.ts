import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "teddybearlaughs@gmail.com",
    pass: "bdfc iqzh ohvf quno",
  },
});

export const sendVerificationRequest = async (email: string, token: string) => {
  const verificationLink = `http://localhost:3000/auth/verify-email?token=${token}`;

  try {
    const mailOptions = {
      from: "Landscape <teddybearlaughs@gmail.com>",
      to: email,
      subject: "Landscape: Confirm your email address ✉",
      html:
        '<p>To complete registration, verify your email by clicking the link below:</p>\
             <p><a href="' +
        verificationLink +
        '"><b>Verify Email</b></a></p>',
    };

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

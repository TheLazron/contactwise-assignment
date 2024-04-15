import { Resend } from "resend";

export const sendVerificationRequest = async (email: string, token: string) => {
  const verificationLink = `http://localhost:3000/verify-email?token=${token}`;
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const resend = new Resend(resendApiKey);
    await resend.emails.send({
      from: "Aryaman <onboarding@resend.dev>",
      to: email,
      subject: "Landscape: Confirm your email address ",
      html:
        '<p>To complete registration, verify your email by clicking the link below:</p>\
             <p><a href="' +
        verificationLink +
        '"><b>Verify Email</b></a></p>',
    });
  } catch (error) {
    console.log({ error });
  }
};

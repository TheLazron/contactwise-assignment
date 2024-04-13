import { Resend } from "resend";
import type { SendVerificationRequestParams } from "next-auth/providers/email";

export const sendVerificationRequest = async (
  params: SendVerificationRequestParams,
) => {
  const {
    identifier: email,
    url,
    provider: { from },
  } = params;

  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const resend = new Resend(resendApiKey);
    await resend.emails.send({
      from: from,
      to: email,
      subject: "Login Link to your Account",
      html:
        '<p>Click the magic link below to sign in to your account:</p>\
             <p><a href="' +
        url +
        '"><b>Sign in</b></a></p>',
    });
  } catch (error) {
    console.log({ error });
  }
};

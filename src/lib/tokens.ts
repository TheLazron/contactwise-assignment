import { db } from "~/server/db";
import { v4 as uuid } from "uuid";

export const getVerificationToken = async (email: string) => {
  try {
    const verificationTkoen = await db.verificationToken.findFirst({
      where: { email },
    });
    return verificationTkoen;
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmail = async (token: string) => {
  try {
    const verificationTkoen = await db.verificationToken.findUnique({
      where: { token },
    });
    return verificationTkoen;
  } catch {
    return null;
  }
};

export const generateVerificationToken = async (email: string) => {
  const token = uuid();
  const expires = new Date(Date.now() + 1000 * 60 * 60);

  const existingToken = await getVerificationToken(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const newToken = await db.verificationToken.create({
    data: {
      token,
      email,
      expires,
    },
  });

  return newToken;
};

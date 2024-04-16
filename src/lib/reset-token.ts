import { db } from "~/server/db";
import { v4 as uuid } from "uuid";

export const getResetTokenByEmail = async (email: string) => {
  try {
    const resetToken = await db.resetPassToken.findFirst({
      where: { email },
    });
    return resetToken;
  } catch {
    return null;
  }
};

export const getResetTokenByToken = async (token: string) => {
  try {
    const resetToken = await db.resetPassToken.findUnique({
      where: { token },
    });
    return resetToken;
  } catch {
    return null;
  }
};

export const generateResetToken = async (email: string) => {
  const token = uuid();
  const expires = new Date(Date.now() + 1000 * 60 * 60);

  const existingToken = await getResetTokenByEmail(email);

  if (existingToken) {
    await db.resetPassToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const newToken = await db.resetPassToken.create({
    data: {
      token,
      email,
      expires,
    },
  });

  return newToken;
};

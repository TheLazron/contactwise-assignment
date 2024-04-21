import {
  LoginSchema,
  NewPasswordSchema,
  RegisterSchema,
  ResetPasswordSchema,
  verifyTokenSchema,
} from "schemas/authSchemas";
import { z } from "zod";
import bcrypt from "bcryptjs";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import {
  generateVerificationToken,
  getVerificationTokenByToken,
} from "~/lib/verification-token";
import { sendMailRequest } from "~/server/nodemailer";
import { verify } from "crypto";
import { generateResetToken } from "~/lib/reset-token";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(RegisterSchema)
    .mutation(async ({ ctx, input }) => {
      const user: z.infer<typeof RegisterSchema> = { ...input };
      console.log("register request", user);

      const existinguser = await ctx.db.user.findFirst({
        where: { email: user.email },
      });

      if (existinguser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });
      }

      const hashedPass = await bcrypt.hash(user.password, 10);

      const createdUser = await ctx.db.user.create({
        data: {
          ...user,
          password: hashedPass,
          image: "https://source.boringavatars.com/beam/120/" + user.name,
        },
      });

      const token = await generateVerificationToken(user.email);

      await sendMailRequest(token.email, token.token, "verification");
      console.log("verification email sent");
      return createdUser;
    }),
  verifyToken: publicProcedure
    .input(verifyTokenSchema)
    .mutation(async ({ ctx, input }) => {
      const { token } = input;

      const existingToken = await getVerificationTokenByToken(token);

      //check for token existence and expiry
      if (!existingToken) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Token not found",
        });
      }
      if (existingToken.expires < new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Token expired",
        });
      }
      //fetch user to check existence and update
      const existingUser = await ctx.db.user.findFirst({
        where: { email: existingToken.email },
      });

      if (!existingUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      await ctx.db.user.update({
        where: { email: existingToken.email },
        data: {
          emailVerified: new Date(),
        },
      });

      //delete token
      await ctx.db.verificationToken.delete({
        where: { token: token },
      });

      return existingUser;
    }),
  resetPassword: publicProcedure
    .input(ResetPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const { email } = input;
      const user = await ctx.db.user.findFirst({
        where: { email },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const token = await generateResetToken(email);

      await sendMailRequest(email, token.token, "password-reset");
      console.log("reset password email sent");
      return user;
    }),
  changePassword: publicProcedure
    .input(NewPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const { password, token } = input;

      const resetToken = await ctx.db.resetPassToken.findFirst({
        where: { token },
      });

      if (!resetToken) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Token not found",
        });
      }

      if (resetToken.expires < new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Token expired",
        });
      }

      const user = await ctx.db.user.findFirst({
        where: { email: resetToken.email },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const hashedPass = await bcrypt.hash(password, 10);

      await ctx.db.user.update({
        where: { email: resetToken.email },
        data: {
          password: hashedPass,
        },
      });

      await ctx.db.resetPassToken.delete({
        where: { token },
      });
    }),
});

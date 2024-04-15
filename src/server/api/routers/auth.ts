import {
  LoginSchema,
  RegisterSchema,
  ResetPasswordSchema,
  verifyTokenSchema,
} from "schemas";
import { z } from "zod";
import bcrypt from "bcryptjs";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import {
  generateVerificationToken,
  getVerificationTokenByToken,
} from "~/lib/tokens";
import { sendVerificationRequest } from "~/server/nodemailer";
import { verify } from "crypto";

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
        },
      });

      const token = await generateVerificationToken(user.email);

      await sendVerificationRequest(token.email, token.token);
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

      const token = await generateVerificationToken(email);

      await sendVerificationRequest(email, token.token);
      console.log("reset password email sent");
      return user;
    }),
});

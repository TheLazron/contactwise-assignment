import { LoginSchema, RegisterSchema } from "schemas";
import type { z } from "zod";
import bcrypt from "bcryptjs";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { generateVerificationToken } from "~/lib/tokens";
import { sendVerificationRequest } from "~/server/nodemailer";

export const authRouter = createTRPCRouter({
  login: publicProcedure.input(LoginSchema).mutation(async ({ ctx, input }) => {
    const user: z.infer<typeof LoginSchema> = {
      email: input.email,
      password: input.password,
    };
    console.log("login request", user);
    return user;
  }),
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
});

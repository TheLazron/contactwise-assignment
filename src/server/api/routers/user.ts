import {
  createTRPCRouter,
  elevatedProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

import { z } from "zod";
import { editProfileSchema } from "schemas/userSchemas";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  getProfileDetails: protectedProcedure.query(async ({ ctx }) => {
    const { id } = ctx.session.user;

    try {
      const user = await ctx.db.user.findUnique({
        where: {
          id,
        },
      });
      //return user without password
      if (user) {
        //return user without password, use spread operator to remove password
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while processing your request",
      });
    }
  }),
  editProfile: protectedProcedure
    .input(editProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, image } = input;
      const { id } = ctx.session.user;

      try {
        const updatedUser = await ctx.db.user.update({
          where: {
            id,
          },
          data: {
            name,
            image,
          },
        });

        return updatedUser;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while processing your request",
        });
      }
    }),
});

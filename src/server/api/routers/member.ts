import {
  adminProcedure,
  createTRPCRouter,
  elevatedProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

import { z } from "zod";
import { editProfileSchema } from "schemas/userSchemas";
import { TRPCError } from "@trpc/server";
import { changeMemberRoleSchema } from "schemas/memberSchemas";

export const memeberRouter = createTRPCRouter({
  getRole: protectedProcedure
    .input(z.object({ orgId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const { id } = ctx.session.user;
        const { orgId } = input;
        const member = await ctx.db.members.findFirst({
          where: {
            userId: id,
            organisationId: orgId,
          },
        });
        if (!member) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Member not found",
          });
        }
        return member;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
  removeMember: adminProcedure
    .input(z.object({ memberId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { memberId } = input;
        await ctx.db.members.delete({
          where: {
            id: memberId,
          },
        });
        return true;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
  chanageRole: adminProcedure
    .input(changeMemberRoleSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { memberId, role } = input;
        const member = await ctx.db.members.update({
          where: {
            id: memberId,
          },
          data: {
            role,
          },
        });
        return { role: role };
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
});

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { z } from "zod";
import { editProfileSchema } from "schemas/userSchemas";
import { TRPCError } from "@trpc/server";
import {
  changeMemberRoleSchema,
  changePermissisonsRequestSchema,
  changePermissisonsSchema,
} from "schemas/memberSchemas";
import type { $Enums, Permissions, PrismaClient } from "@prisma/client";

const checkForPermissions = async (
  db: PrismaClient,
  organisationId: string,
  userId: string,
  requiredPermission: Permissions,
): Promise<boolean> => {
  const member = await db.members.findFirst({
    where: {
      userId: userId,
      organisationId: organisationId,
    },
  });
  if (!member?.permissions?.includes(requiredPermission)) {
    return false;
  }
  return true;
};

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
  removeMember: protectedProcedure
    .input(z.object({ memberId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.session.user;
      const { memberId } = input;
      try {
        const member = await ctx.db.members.findFirst({
          where: { id: memberId },
        });
        if (!member) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Member not found",
          });
        }
        if (
          !(await checkForPermissions(
            ctx.db,
            member.organisationId,
            userId,
            "KICK_USERS",
          ))
        ) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You are not authorized",
          });
        }
        await ctx.db.members.delete({ where: { id: memberId } });
        return true;
      } catch (error) {
        throw error instanceof TRPCError
          ? error
          : new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "An error occurred while processing your request",
            });
      }
    }),
  changeRole: protectedProcedure
    .input(changeMemberRoleSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.session.user;
      const { memberId, role } = input;
      try {
        const member = await ctx.db.members.findFirst({
          where: { id: memberId },
        });
        if (!member) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Member not found",
          });
        }
        if (
          !(await checkForPermissions(
            ctx.db,
            member.organisationId,
            userId,
            "CHANGE_ROLES",
          ))
        ) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Permission denied to edit",
          });
        }
        const permissionsArray: Permissions[] = [];
        role === "manager" ? permissionsArray.push("EDIT_ORG") : null;

        await ctx.db.members.update({
          where: {
            id: memberId,
          },
          data: {
            role,
            permissions: permissionsArray,
          },
        });
        return { role: role };
      } catch (error) {
        throw error instanceof TRPCError
          ? error
          : new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "An error occurred while processing your request",
            });
      }
    }),
  changePermissions: protectedProcedure
    .input(changePermissisonsRequestSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id: userId } = ctx.session.user;
        const { memberId, permissions } = input;
        const member = await ctx.db.members.findFirst({
          where: { id: memberId },
        });
        if (!member) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Member not found",
          });
        }
        const userMemberObject = await ctx.db.members.findFirst({
          where: {
            userId,
            organisationId: member.organisationId,
          },
        });
        if (!userMemberObject || userMemberObject.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You are not authorized",
          });
        }
        await ctx.db.members.update({
          where: {
            id: memberId,
          },
          data: {
            permissions,
          },
        });
        return { permissions };
      } catch (error) {
        throw error instanceof TRPCError
          ? error
          : new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "An error occurred while processing your request",
            });
      }
    }),
});

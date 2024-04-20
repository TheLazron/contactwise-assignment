import { Permissions, PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { join } from "path";
import {
  createOrganisationSchema,
  editOrganisationSchema,
} from "schemas/organisationSchemas";
import { z } from "zod";
import generateOrgCode from "~/lib/generateCode";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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

export const organisationRouter = createTRPCRouter({
  createOrg: protectedProcedure
    .input(createOrganisationSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, description, bannerImg } = input;
      const { id } = ctx.session.user;
      const code = await generateOrgCode();

      try {
        const newOrg = await ctx.db.$transaction(async (prisma) => {
          const org = await prisma.organisation.create({
            data: {
              name,
              description,
              bannerImg,
              ownerId: id,
              code,
            },
          });

          await prisma.members.create({
            data: {
              userId: id,
              organisationId: org.id,
              role: "admin",
              permissions: ["CHANGE_ROLES", "EDIT_ORG", "KICK_USERS"],
            },
          });

          return org;
        });

        return newOrg;
      } catch (error) {
        throw error instanceof TRPCError
          ? error
          : new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "An error occurred while processing your request",
            });
      }
    }),
  joinOrg: protectedProcedure
    .input(z.object({ code: z.string() }))
    .mutation(({ ctx, input }) => {
      const { code } = input;
      const { id: userId } = ctx.session.user;

      return ctx.db.$transaction(async (prisma) => {
        const org = await prisma.organisation.findFirst({ where: { code } });

        if (!org) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Organisation not found",
          });
        }

        const member = await prisma.members.findFirst({
          where: {
            userId,
            organisationId: org.id,
          },
        });

        if (member) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "You are already a member of this organisation",
          });
        }

        await prisma.members.create({
          data: {
            userId,
            organisationId: org.id,
            role: "user",
            permissions: [],
          },
        });

        return org;
      });
    }),
  getOrgs: protectedProcedure.query(async ({ ctx }) => {
    try {
      const { id: userId } = ctx.session.user;
      const orgs = await ctx.db.organisation.findMany({
        where: {
          members: {
            some: {
              userId,
            },
          },
        },
        select: {
          id: true,
          owner: true,
          bannerImg: true,
          name: true,
          members: {
            select: { userId: true },
          },
        },
      });

      type OrgWithMemberCount = typeof orgs & { memberCount: number };

      const resOrgs = orgs.map((org) => {
        return { ...org, memberCount: org.members.length };
      });

      return resOrgs.map((org) => org);
    } catch (error) {
      throw error instanceof TRPCError
        ? error
        : new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An error occurred while processing your request",
          });
    }
  }),
  getOrg: protectedProcedure
    .input(z.object({ orgId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { orgId } = input;
      const { id: userId } = ctx.session.user;

      try {
        const org = await ctx.db.organisation.findUnique({
          where: { id: orgId },
          select: {
            id: true,
            owner: {
              select: {
                id: true,
                name: true,
              },
            },
            bannerImg: true,
            name: true,
            description: true,
            code: true,
            members: {
              select: { userId: true },
            },
          },
        });

        if (!org) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Organisation not found",
          });
        }

        const member = org.members.find((member) => member.userId === userId);

        if (!member) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You are not a member of this organisation",
          });
        }

        const members = await ctx.db.members.findMany({
          where: {
            organisationId: orgId,
          },
          select: {
            id: true,
            user: true,
            role: true,
            joinedOn: true,
            permissions: true,
          },
        });

        const data = { ...org, members };
        return data;
      } catch (error) {
        throw error instanceof TRPCError
          ? error
          : new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "An error occurred while processing your request",
            });
      }
    }),
  editOrg: protectedProcedure
    .input(editOrganisationSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.session.user;
      const { orgId, name, description, bannerImg } = input;
      const whereClause = { id: orgId };
      try {
        const org = await ctx.db.organisation.findFirst({ where: whereClause });
        if (!org) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Organisation not found",
          });
        }
        if (!(await checkForPermissions(ctx.db, orgId, userId, "EDIT_ORG"))) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You are not authroized",
          });
        }
        const updatedOrg = await ctx.db.organisation.update({
          where: whereClause,
          data: {
            name,
            description,
            bannerImg,
          },
        });
        return updatedOrg;
      } catch (error) {
        throw error instanceof TRPCError
          ? error
          : new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "An error occurred while processing your request",
            });
      }
    }),
  deleteOrganisation: protectedProcedure
    .input(z.object({ orgId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { orgId } = input;
        const { id: userId } = ctx.session.user;

        const member = await ctx.db.members.findFirst({
          where: {
            userId: userId,
            organisationId: orgId,
          },
        });
        if (!member || member.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You are not authorized",
          });
        }

        const whereClause = { id: orgId };
        const org = await ctx.db.organisation.findFirst({ where: whereClause });
        if (!org) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Organisation not found",
          });
        }
        await ctx.db.$transaction([
          ctx.db.members.deleteMany({ where: { organisationId: orgId } }),
          ctx.db.organisation.delete({ where: whereClause }),
        ]);
        return org;
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

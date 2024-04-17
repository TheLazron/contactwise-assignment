import { TRPCError } from "@trpc/server";
import { join } from "path";
import { createOrganisationSchema } from "schemas/organisationSchemas";
import { z } from "zod";
import generateOrgCode from "~/lib/generateCode";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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
            },
          });

          return org;
        });

        return newOrg;
      } catch (error) {
        throw new TRPCError({
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
          },
        });

        return org;
      });
    }),
  deleteOrg: protectedProcedure
    .input(z.object({ orgId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { orgId } = input;
      const { id: userId } = ctx.session.user;
      const whereClause = { id: orgId };

      try {
        const org = await ctx.db.organisation.findFirst({ where: whereClause });

        if (!org) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Organisation not found",
          });
        }
        if (org.ownerId !== userId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You are not the owner of this organisation",
          });
        }
        await ctx.db.organisation.delete({ where: whereClause });
        return org;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while processing your request",
        });
      }
    }),
  getOrgs: protectedProcedure.query(async ({ ctx }) => {
    try {
      const { id: userId } = ctx.session.user;
      const orgs = await ctx.db.members.findMany({
        where: {
          userId,
        },
        select: {
          organisation: true,
        },
      });
      return orgs;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while processing your request",
      });
    }
  }),
});
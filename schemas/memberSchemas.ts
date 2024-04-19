import { Permissions, Role } from "@prisma/client";
import { boolean, z } from "zod";

export const changeMemberRoleSchema = z.object({
  memberId: z.string(),
  role: z.nativeEnum(Role),
});

export const changePermissisonsSchema = z.object({
  memberId: z.string(),
  permissions: z.object({
    EDIT_ORG: z.boolean(),
    KICK_USERS: z.boolean(),
    CHANGE_ROLES: z.boolean(),
  }),
});
export const changePermissisonsRequestSchema = z.object({
  memberId: z.string(),
  permissions: z.array(z.nativeEnum(Permissions)),
});

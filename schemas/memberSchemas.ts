import { Role } from "@prisma/client";
import { z } from "zod";

export const changeMemberRoleSchema = z.object({
  memberId: z.string(),
  role: z.nativeEnum(Role),
});

import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Password should be at least 6 characters long",
  }),
  name: z.string().min(3, {
    message: "Name should be at least 3 characters long",
  }),
});

export const verifyTokenSchema = z.object({
  token: z.string(),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Password should be at least 6 characters long",
  }),
  token: z.string(),
});

export const OrgObjectSchema = z.object({
  orgName: z.string().min(3),
  owner: z.string(),
  memberCount: z.number().positive(),
  bannerImg: z.string().url(),
});

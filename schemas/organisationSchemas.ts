import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const createOrganisationSchema = z.object({
  name: z.string().min(3, {
    message: "Org Name must be 3 characters long",
  }),
  description: z.string().min(10, {
    message: "Org Description must be 10 characters long",
  }),
  bannerImg: z.string().url({
    message: "Banner Image must be a valid URL",
  }),
});

export const joinOrganisationSchema = z.string().length(6, {
  message: "Org Code must be 6 characters long",
});

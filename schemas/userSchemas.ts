import { z } from "zod";

export const editProfileSchema = z.object({
  name: z.string().min(3, {
    message: "Name should be at least 3 characters long",
  }),
  image: z.string().url({
    message: "Image must be a valid URL",
  }),
});

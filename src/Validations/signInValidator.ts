import { z } from "zod";

export const signInValidator = z.object({
  identifier: z.string().min(3, { message: "Invalid email address/username" }),
  password: z
    .string()
    .min(6, { message: "password should be at least 6 character" }),
});

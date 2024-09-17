import { z } from "zod";

const UsernameValidator = z
  .string()
  .toLowerCase()
  .min(3, { message: "username should be at least 3 character" })
  .max(10)
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "username must not contain special character",
  });

export const signupValidator = z.object({
  username: UsernameValidator,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "password should be at least 6 character" }),
});

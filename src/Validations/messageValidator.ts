import { z } from "zod";

export const messageValidator = z.object({
  content: z
    .string()
    .min(5, { message: "message must be at least 10 character" })
    .max(200, { message: "message must not be no longer then 200 character" }),
});

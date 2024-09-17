import { z } from "zod";

export const acceptMessageValidator = z.object({
  acceptMessages: z.boolean(),
});

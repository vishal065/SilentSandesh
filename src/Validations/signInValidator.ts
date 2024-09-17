import { z } from "zod";


export const signInValidator = z.object({
    identifier : z.string(),
    password:z.string()
})
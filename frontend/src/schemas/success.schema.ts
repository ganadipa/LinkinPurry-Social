import { z } from "zod";

export const SuccessResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  body: z.object({}).passthrough().nullable(),
});

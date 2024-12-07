import { z } from "zod";

export const ErrorSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.object({}).passthrough().nullable(),
});

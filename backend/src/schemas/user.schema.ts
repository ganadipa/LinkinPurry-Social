import { z } from "zod";

// params for /api/users/:id
export const GetUserByIdParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a numeric string"),
});

// schema for /api/users/:id
export const GetUserByIdResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  body: z.object({
    id: z.number(),
    full_name: z.string(),
    profile_photo_path: z.string().nullable(),
  }),
});

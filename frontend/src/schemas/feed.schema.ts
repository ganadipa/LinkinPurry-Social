import { z } from "zod";

export const FeedRelatedSchemas = z.object({
  post: z.object({
    id: z.number(),
    created_at: z.number(), // Unix timestamp
    updated_at: z.number(),
    content: z.string(),
  }),
  user: z.object({
    username: z.string(),
    fullname: z.string(),
    profile_photo_path: z.string(),
  }),
});

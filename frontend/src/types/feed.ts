import { FeedRelatedSchemas } from "@/schemas/feed.schema";
import { z } from "zod";

export type Post = {
  created_at: string | null;
  id: number | null;
  content: string;
  updated_at: string | null;
};

export const PostSchema = z.object({
  created_at: z.string().nullable(),
  id: z.number().nullable(),
  content: z.string(),
  updated_at: z.string().nullable(),
});

export type Feed = Post & {
  user_id: number;
};

export const FeedSchema = z.intersection(
  PostSchema,
  z.object({
    user_id: z.number(),
  })
);

export type FeedRelated = z.infer<typeof FeedRelatedSchemas>;

import { z } from "zod";
import { SuccessResponseSchema } from "./success.schema";

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

export const GetFeedSuccessSchema = SuccessResponseSchema.extend({
  body: z.array(FeedRelatedSchemas),
});

export const CreatePostSuccessSchema = SuccessResponseSchema.extend({
  body: FeedRelatedSchemas,
});

export const EditPostSuccessSchema = SuccessResponseSchema.extend({
  body: FeedRelatedSchemas,
});

export const DeletePostSuccessSchema = SuccessResponseSchema;

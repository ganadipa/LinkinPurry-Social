import { SuccessResponseSchema } from "../constants/types";
import { z } from "zod";

export const FeedRelatedSchemas = z.object({
  post: z.object({
    id: z.number(),
    created_at: z.number(), // Unix timestamp
    updated_at: z.number(),
    content: z.string(),
  }),
  user: z.object({
    id: z.number(),
    username: z.string(),
    fullname: z.string(),
    profile_photo_path: z.string(),
  }),
});

export const GetFeedSuccessSchema = SuccessResponseSchema.extend({
  body: z.object({
    cursor: z.union([z.number(), z.null(), z.string()]),
    posts: z.array(FeedRelatedSchemas),
  }),
});

export type GetFeedSuccess = z.infer<typeof GetFeedSuccessSchema>;

export type FeedRelated = z.infer<typeof FeedRelatedSchemas>;

export const CreatePostRequestSchema = z.object({
  content: z.string().max(280, {
    message: "Content must not exceed 280 characters",
  }),
});

export const CreatePostSuccessSchema = SuccessResponseSchema.extend({
  body: FeedRelatedSchemas,
});

export const DeletePostRequestSchema = z.object({
  postId: z.number(),
});

export const DeletePostSuccessSchema = SuccessResponseSchema;

export const EditPostRequestSchema = z.object({
  content: z.string().max(280, {
    message: "Content must not exceed 280 characters",
  }),
});

export const EditPostSuccessSchema = SuccessResponseSchema.extend({
  body: FeedRelatedSchemas,
});

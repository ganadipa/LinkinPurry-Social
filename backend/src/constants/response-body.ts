import { z } from "zod";
import { Post, SuccessResponseSchema } from "./types";

const PostSchema = z.object({
  id: z.bigint().optional(),
  content: z.string(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

const PostNumberTimestampSchema = z.object({
  id: z.number(),
  content: z.string(),
  created_at: z.number(),
  updated_at: z.number(),
});

const PublicProfileSchema = z.object({
  username: z.string(),
  name: z.string(),
  work_history: z.string().nullable(),
  skills: z.string().nullable(),
  connection_count: z.number(),
  profile_photo: z.string(),
});

const AuthenticatedProfileSchema = PublicProfileSchema.extend({
  relevant_posts: z.array(PostNumberTimestampSchema),
});

export const GetPublicProfileSuccessSchema = SuccessResponseSchema.extend({
  body: PublicProfileSchema,
});

export type TGetProfileBodyResponseByPublic = z.infer<
  typeof PublicProfileSchema
>;

export const GetAuthenticatedProfileSuccessSchema =
  SuccessResponseSchema.extend({
    body: AuthenticatedProfileSchema,
  });

export type TGetProfileBodyResponseByAuthenticated = z.infer<
  typeof AuthenticatedProfileSchema
>;

export const LoginSuccessSchema = SuccessResponseSchema.extend({
  body: z.object({
    token: z.string(),
  }),
});

export const MeSuccessSchema = SuccessResponseSchema.extend({
  body: z
    .object({
      id: z.number(),
      username: z.string(),
      name: z.string(),
      email: z.string(),
    })
    .nullable(),
});

export const LogoutSuccessSchema = SuccessResponseSchema;

export const RegisterSuccessSchema = SuccessResponseSchema.extend({
  body: z.object({
    token: z.string(),
  }),
});

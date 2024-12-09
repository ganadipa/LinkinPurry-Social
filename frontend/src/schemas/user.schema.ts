import { z } from "zod";

export const GetUsersBodyResponseSchema = z.array(
  z.object({
    id: z.number(),
    username: z.string(),
    name: z.string(),
    profile_photo_path: z.string(),
    email: z.string(),
  })
);

export const GetUsersResponseSuccessSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  body: GetUsersBodyResponseSchema,
});

export type GetUsersResponseSuccess = z.infer<
  typeof GetUsersResponseSuccessSchema
>;

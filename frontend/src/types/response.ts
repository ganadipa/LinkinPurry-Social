import z from "zod";

export const loginResponse = z.object({
  success: z.boolean(),
  message: z.string(),
  body: z
    .object({
      token: z.string(),
    })
    .nullable(),
});

export const registerResponse = z.object({
  success: z.boolean(),
  message: z.string(),
  body: z.object({
    token: z.string(),
  }),
});

export const getUsersResponse = z.object({
  success: z.boolean(),
  message: z.string(),
  body: z.array(
    z.object({
      id: z.number(),
      full_name: z.string(),
      profile_photo_path: z.string(),
    })
  ),
});

export const profileResponse = z.object({
  success: z.boolean(),
  message: z.string(),
  body: z.object({
    username: z.string(),
    name: z.string(),
    work_history: z.string().nullable(),
    skills: z.string().nullable(),
    connection_count: z.number(),
    profile_photo: z.string(),
    relevant_posts: z
      .array(
        z.object({
          created_at: z.number().nullable(),
          id: z.number().nullable(),
          content: z.string(),
          updated_at: z.number().nullable(),
        })
      )
      .optional(),
  }),
});

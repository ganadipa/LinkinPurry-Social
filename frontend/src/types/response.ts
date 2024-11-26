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
    )
})



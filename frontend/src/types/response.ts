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

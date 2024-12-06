"use client";

import { z } from "zod";

export const signInFormSchema = z.object({
  identifier: z
    .string()
    .min(1, { message: "Email or username is required" })
    .refine((value) => !value.includes(" "), {
      message: "Email or username should not contain spaces",
    }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
    .max(50, { message: "Password is too long" })
    .refine((value) => !value.includes(" "), {
      message: "Password should not contain spaces",
    }),
});

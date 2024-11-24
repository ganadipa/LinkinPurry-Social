"use client";

import { z } from "zod";

export const signInFormSchema = z.object({
  email_or_username: z
    .string()
    .min(1, { message: "Email or username is required" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
    .max(50, { message: "Password is too long" }),
});

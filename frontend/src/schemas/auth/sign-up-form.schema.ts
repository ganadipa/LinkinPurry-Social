import { z } from "zod";

export const registrationFormSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username cannot exceed 50 characters")
      .refine((value) => !value.includes(" "), {
        message: "Username should not contain spaces",
      }),
    email: z
      .string()
      .trim()
      .email("Invalid email format")
      .min(1, "Email is required")
      .refine((value) => !value.includes(" "), {
        message: "Email should not contain spaces",
      }),
    name: z
      .string()
      .min(1, "Full name is required")
      .max(100, "Full name cannot exceed 100 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password cannot exceed 100 characters")
      .refine((value) => !value.includes(" "), {
        message: "Password should not contain spaces",
      }),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

import { z } from "zod";
import { BadRequestException } from "../exceptions/bad-request.exception";

export type LoginPayload = {
  identifier: string;
  password: string;
};

export const loginPayloadSchema = z.object({
  identifier: z
    .string({
      message: "Identifier must be a string",
    })
    .min(1, {
      message: "Identifier must not be empty",
    })
    .max(50, {
      message: "Identifier must be less than 50 characters",
    }),
  password: z
    .string({
      message: "Password must be a string",
    })
    .min(6, {
      message: "Password must be at least 6 characters",
    })
    .max(50, {
      message: "Password must be less than 50 characters",
    }),
});

export type RegisterPayload = {
  username: string;
  email: string;
  name: string;
  password: string;
};

export const registerPayloadSchema = z.object({
  username: z
    .string({
      message: "Username must be a string",
    })
    .min(1, {
      message: "Username must not be empty",
    })
    .max(50, {
      message: "Username must be less than 50 characters",
    }),
  email: z
    .string({
      message: "Email must be a string",
    })
    .min(1, {
      message: "Email must not be empty",
    })
    .max(50, {
      message: "Email must be less than 50 characters",
    }),
  name: z.string({
    message: "Name must be a string",
  }),
  password: z
    .string({
      message: "Password must be a string",
    })
    .min(6, {
      message: "Password must be at least 6 characters",
    })
    .max(50, {
      message: "Password must be less than 50 characters",
    }),
});

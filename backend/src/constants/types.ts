import { JsonArray, JsonObject } from "@prisma/client/runtime/library";
import { Feed } from "../models/feed.model";
import { z } from "zod";

export const BaseResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.record(z.any()).nullable(),
});

export const SuccessResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  body: z.object({}).passthrough().nullable(),
});

export type Post = Omit<Feed, "user_id">;

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonArray;

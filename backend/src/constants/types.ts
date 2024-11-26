import { JsonArray, JsonObject } from "@prisma/client/runtime/library";
import { Feed } from "../models/feed.model";

export type BaseResponse = {
  success: boolean;
  message: string;
};

export type ErrorResponse = BaseResponse & {
  error: null | Object;
};

export type SuccessResponse<T> = BaseResponse & {
  body: T;
};

export type Post = Omit<Feed, "user_id">;

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonArray;

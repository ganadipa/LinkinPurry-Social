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

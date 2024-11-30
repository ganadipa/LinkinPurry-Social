import { LoginPayload, RegisterPayload } from "./request-payload";

export type LoginEnv = {
  Variables: {
    loginPayload: LoginPayload;
  };
};

export type RegisterEnv = {
  Variables: {
    registerPayload: RegisterPayload;
  };
};

export type GetFeedEnv = {
  Variables: {
    limit?: number;
    cursor?: number;
  };
};

export type CreatePostEnv = {
  Variables: {
    content: string;
  };
};

export type UpdatePostEnv = {
  Variables: {
    postId: number;
    content: string;
  };
};

export type DeletePostEnv = {
  Variables: {
    postId: number;
  };
};

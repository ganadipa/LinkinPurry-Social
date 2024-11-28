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

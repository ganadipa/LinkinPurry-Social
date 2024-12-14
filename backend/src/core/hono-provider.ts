import { Hono } from "hono";
import { injectable } from "inversify";
import { User } from "../models/user.model";
import { OpenAPIHono } from "@hono/zod-openapi";
export type Variables = {
  user: User | null;
};

@injectable()
export class HonoProvider {
  public app: Hono<{
    Variables: Variables;
  }>;

  constructor() {
    this.app = new Hono<{
      Variables: Variables;
    }>();
  }
}

@injectable()
export class OpenApiHonoProvider {
  public app: OpenAPIHono<{
    Variables: Variables;
  }>;

  constructor() {
    this.app = new OpenAPIHono<{
      Variables: Variables;
    }>();
  }
}

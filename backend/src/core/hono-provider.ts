import { Hono } from "hono";
import { injectable } from "inversify";
import { User } from "../models/user.model";

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

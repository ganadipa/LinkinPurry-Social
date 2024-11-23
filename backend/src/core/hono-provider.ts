import { Hono } from "hono";
import { injectable } from "inversify";

@injectable()
export class HonoProvider {
  public app: Hono;

  constructor() {
    this.app = new Hono();
  }
}

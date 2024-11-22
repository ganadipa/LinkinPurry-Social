import { Context } from "hono";

export class Controller {
  public hello(c: Context) {
    return c.text("Hello Hono!");
  }
}

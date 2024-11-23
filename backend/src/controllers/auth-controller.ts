import { inject, injectable } from "inversify";
import { Controller } from "./controller";
import { CONFIG } from "../ioc/config";
import { HonoProvider } from "../core/hono-provider";

@injectable()
export class AuthController implements Controller {
  constructor(@inject(CONFIG.HonoProvider) private hono: HonoProvider) {}

  public registerRoutes(): void {
    this.hono.app.get("/auth", (c) => {
      return c.html("Hello, world!");
    });
  }
}

import { inject, injectable } from "inversify";
import { Controller } from "./controller";
import { CONFIG } from "../ioc/config";
import { HonoProvider } from "../core/hono-provider";
import { serveStatic } from "@hono/node-server/serve-static";

@injectable()
export class ServeStaticController implements Controller {
  constructor(@inject(CONFIG.HonoProvider) private hono: HonoProvider) {}

  public registerRoutes(): void {
    const distRelativeToRoot = "../frontend/dist";

    // Serve all static files from `distRelativeToRoot` directory
    this.hono.app.use("/*", serveStatic({ root: distRelativeToRoot }));
  }
}

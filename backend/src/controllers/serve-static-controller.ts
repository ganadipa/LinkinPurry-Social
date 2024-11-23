import { inject, injectable } from "inversify";
import { Controller } from "./controller";
import { CONFIG } from "../ioc/config";
import { HonoProvider } from "../core/hono-provider";
import { serveStatic } from "@hono/node-server/serve-static";

@injectable()
export class ServeStaticController implements Controller {
  constructor(@inject(CONFIG.HonoProvider) private hono: HonoProvider) {}

  public registerRoutes(): void {
    const distRelativeToRoot = "../public";

    // Serve all static files from `distPath`
    this.hono.app.use("/*", serveStatic({ root: distRelativeToRoot }));
  }
}

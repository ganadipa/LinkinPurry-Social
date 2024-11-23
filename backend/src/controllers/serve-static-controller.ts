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

    this.hono.app.use("/*", serveStatic({ root: distRelativeToRoot }));

    this.hono.app.get("*", async (c, next) => {
      return await serveStatic({
        root: distRelativeToRoot,
        path: "index.html",
      })(c, next);
    });
  }
}

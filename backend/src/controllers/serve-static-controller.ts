import { inject, injectable } from "inversify";
import { Controller } from "./controller";
import { CONFIG } from "../ioc/config";
import { HonoProvider, OpenApiHonoProvider } from "../core/hono-provider";
import { serveStatic } from "@hono/node-server/serve-static";

@injectable()
export class ServeStaticController implements Controller {
  constructor(
    @inject(CONFIG.OpenApiHonoProvider) private hono: OpenApiHonoProvider
  ) {}

  public registerMiddlewaresbeforeGlobal(): void {}

  public registerMiddlewaresAfterGlobal(): void {}

  public registerRoutes(): void {
    const distRelativeToRoot = "../frontend/dist";

    if (process.env.ENVIRONMENT === "docker") {
      console.log("in the response formatter middleware");
      this.hono.app.use(
        "/uploads/*",
        serveStatic({
          root: "../../var/www/uploads/public",
          rewriteRequestPath: (path) => path.replace("/uploads", ""),
        })
      );
    } else {
      console.log("in the response formatter middleware");
      this.hono.app.use(
        "/uploads/*",
        serveStatic({
          root: "../uploads/public",
          rewriteRequestPath: (path) => path.replace("/uploads", ""),
        })
      );
    }

    this.hono.app.use("*", async (c, next) => {
      return await serveStatic({
        root: distRelativeToRoot,
      })(c, next);
    });

    this.hono.app.get("/*", async (c, next) => {
      return await serveStatic({
        root: distRelativeToRoot,
        path: "index.html",
      })(c, next);
    });
  }
}

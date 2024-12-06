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
    const slash = "../../";
    const uploadsPath = slash + "var/www/uploads/public";

    this.hono.app.use(
      "/uploads/*",
      serveStatic({
        root: "../../var/www/uploads/public",
        rewriteRequestPath: (path) => path.replace("/uploads", ""),
      })
    );

    // this.hono.app.use("/uploads/*", async (c, next) => {
    //   console.log("uploads path", uploadsPath);
    //   return await serveStatic({
    //     root: uploadsPath,
    //   })(c, next);
    // });

    // this.hono.app.get("*", async (c, next) => {
    //   console.log("uploads path");
    //   return await serveStatic({
    //     root: ".",
    //   })(c, next);
    // });
  }
}

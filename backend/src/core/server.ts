import { injectable, inject } from "inversify";
import { CONFIG } from "../ioc/config";
import { ServerType, serve } from "@hono/node-server";
import { OpenApiHonoProvider } from "./hono-provider";

@injectable()
export class Server {
  public server: ServerType | null = null;

  constructor(
    @inject(CONFIG.OpenApiHonoProvider) private hono: OpenApiHonoProvider
  ) {}

  public start(port: number): void {
    this.server = serve({
      fetch: this.hono.app.fetch,
      port,
    });
  }
}

import { injectable, inject } from "inversify";
import { CONFIG } from "../ioc/config";
import { serve } from "@hono/node-server";
import { HonoProvider } from "./hono-provider";

@injectable()
export class Server {
  constructor(@inject(CONFIG.HonoProvider) private hono: HonoProvider) {}

  public start(port: number): void {
    serve({
      fetch: this.hono.app.fetch,
      port,
    });

    console.log(`Server starting on port ${port}: http://localhost:${port}`);
  }
}

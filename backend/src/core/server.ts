import { Hono } from "hono";
import { serve } from "@hono/node-server";

export class Server {
  constructor(private app: Hono) {}

  public start(port: number): void {
    serve({
      fetch: this.app.fetch,
      port,
    });

    console.log(`Server running: http://localhost:${port}`);
  }
}

import { inject, injectable } from "inversify";
import { Server as SocketIOServer } from "socket.io";
import { CONFIG } from "../ioc/config";
import { OpenApiHonoProvider } from "./hono-provider";
import { Server as HTTPServer } from "node:https";
import { Server } from "./server";

@injectable()
export class SocketProvider {
  public io: SocketIOServer;

  constructor(
    @inject(CONFIG.OpenApiHonoProvider) private hono: OpenApiHonoProvider,
    @inject(CONFIG.Server) private server: Server
  ) {
    this.io = new SocketIOServer(this.server.server as HTTPServer, {
      path: "/ws",
      serveClient: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
  }
}

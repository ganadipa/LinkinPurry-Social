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
    console.log("Socket provider initialized");
    this.io = new SocketIOServer(this.server.server as HTTPServer, {
      path: "/ws",
      serveClient: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
      transports: ["websocket"],
    });
    console.log("Socket provider initialized");

    // Add this to debug connection attempts
    this.io.engine.on("headers", (headers, req) => {
      console.log("Socket headers:", headers);
    });

    this.io.engine.on("initial_headers", (headers, req) => {
      console.log("Socket initial headers:", headers);
    });

    this.io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);
    });
  }
}

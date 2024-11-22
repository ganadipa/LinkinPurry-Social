import { Hono } from "hono";
import { Server } from "./server";
import { Controller } from "./controller";
import { Router } from "./router";

export class Application {
  private app: Hono;
  private server: Server;
  private router: Router;
  private controller: Controller;

  constructor() {
    this.app = new Hono();
    this.controller = new Controller();
    this.router = new Router(this.app, this.controller);
    this.server = new Server(this.app);
  }

  public initialize(): void {
    this.router.registerRoutes();
  }

  public start(port: number): void {
    this.initialize();
    this.server.start(port);
  }

  public getApp(): Hono {
    return this.app;
  }
}

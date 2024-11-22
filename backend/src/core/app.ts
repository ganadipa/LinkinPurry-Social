import "reflect-metadata";

import { Hono } from "hono";
import { Server } from "./server";
import { Controller } from "./controller";
import { Router } from "./router";
import { Container } from "inversify";

import { UserService } from "../services/user.service";
import { EmailService } from "../services/email.service";

export class Application {
  private app: Hono;
  private server: Server;
  private router: Router;
  private controller: Controller;
  private container: Container;

  constructor() {
    this.app = new Hono();
    this.controller = new Controller();
    this.router = new Router(this.app, this.controller);
    this.server = new Server(this.app);
    this.container = new Container();
  }

  public initialize(): void {
    this.router.registerRoutes();
    this.initializeContainer();
  }

  public start(port: number): void {
    this.initialize();
    this.server.start(port);
  }

  public getApp(): Hono {
    return this.app;
  }

  public initializeContainer(): void {
    this.container.bind(EmailService).toSelf().inSingletonScope();
    this.container.bind(UserService).toSelf();
  }
}

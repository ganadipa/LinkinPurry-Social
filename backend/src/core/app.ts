import "reflect-metadata";

import { Container } from "inversify";
import { Server } from "./server";
import { Router } from "./router";
import { CONFIG } from "../ioc/config";
import { Hono } from "hono";
import { EmailService } from "../services/email.service";
import { UserService } from "../services/user.service";
import { HonoProvider } from "./hono-provider";
import { Controller } from "../controllers/controller";
import { AuthController } from "../controllers/auth-controller";
import { ServeStaticController } from "../controllers/serve-static-controller";

export class Application {
  private container: Container;

  constructor() {
    this.container = new Container();
    this.initializeContainer();
  }

  private initializeContainer(): void {
    this.container
      .bind<HonoProvider>(CONFIG.HonoProvider)
      .to(HonoProvider)
      .inSingletonScope();

    this.container.bind<Server>(CONFIG.Server).to(Server).inSingletonScope();
    this.container.bind<Router>(CONFIG.Router).to(Router).inSingletonScope();

    this.container
      .bind<Controller>(CONFIG.Controllers)
      .to(AuthController)
      .inSingletonScope();
    this.container
      .bind<Controller>(CONFIG.Controllers)
      .to(ServeStaticController)
      .inSingletonScope();

    this.container
      .bind<EmailService>(CONFIG.EmailService)
      .to(EmailService)
      .inSingletonScope();
    this.container
      .bind<UserService>(CONFIG.UserService)
      .to(UserService)
      .inSingletonScope();
  }

  public start(port: number): void {
    const server = this.container.get<Server>(CONFIG.Server);
    const router = this.container.get<Router>(CONFIG.Router);
    server.start(port);
    router.registerRoutes();
  }

  public getApp(): Hono {
    return this.container.get<HonoProvider>(CONFIG.HonoProvider).app;
  }
}

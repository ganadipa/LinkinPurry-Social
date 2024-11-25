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
import { HTTPException } from "hono/http-exception";
import { IAuthStrategy } from "../interfaces/auth-strategy.interface";
import { JwtAuthStrategy } from "../middlewares/auth/strategy/jwt.strategy";
import { AuthMiddleware } from "../middlewares/auth/auth.middleware";
import { UserRepository } from "../interfaces/user-repository.interface";
import { DbUserRepository } from "../repositories/db/user.repository";
import { PrismaProvider } from "../prisma/prisma";
import { JwtService } from "../services/auth/jwt.service";
import { AuthService } from "../services/auth/auth.service";
import { ValidationService } from "../services/validation.service";

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

    // if (process.env.ENVIRONMENT && process.env.ENVIRONMENT === "prod") {
    this.container
      .bind<Controller>(CONFIG.Controllers)
      .to(ServeStaticController)
      .inSingletonScope();
    // }

    this.container
      .bind<EmailService>(CONFIG.EmailService)
      .to(EmailService)
      .inSingletonScope();
    this.container
      .bind<UserService>(CONFIG.UserService)
      .to(UserService)
      .inSingletonScope();

    this.container
      .bind<IAuthStrategy>(CONFIG.JwtAuthStrategy)
      .to(JwtAuthStrategy)
      .inSingletonScope();

    this.container
      .bind<AuthMiddleware>(CONFIG.AuthMiddleware)
      .to(AuthMiddleware);

    this.container
      .bind<UserRepository>(CONFIG.DbUserRepository)
      .to(DbUserRepository);

    this.container
      .bind<PrismaProvider>(CONFIG.PrismaProvider)
      .to(PrismaProvider);

    this.container.bind<JwtService>(CONFIG.JwtService).to(JwtService);
    this.container.bind<AuthService>(CONFIG.AuthService).to(AuthService);
    this.container
      .bind<ValidationService>(CONFIG.ValidationService)
      .to(ValidationService);
  }

  public start(port: number): void {
    const server = this.container.get<Server>(CONFIG.Server);
    const router = this.container.get<Router>(CONFIG.Router);
    server.start(port);

    router.registerMiddlewaresBeforeGlobal();
    this.registerGlobalMiddlewares();
    router.registerMiddlewaresAfterGlobal();
    router.registerRoutes();

    this.configureHono();
  }

  public configureHono(): void {
    const hono = this.container.get<HonoProvider>(CONFIG.HonoProvider).app;
    hono.onError((err, c) => {
      if (err instanceof HTTPException) {
        const formattedResponse = {
          status: "error",
          message: err.message,
          body: null,
        };

        c.status(err.status);

        return c.json(formattedResponse);
      }

      c.status(500);

      return c.json({
        status: "error",
        message: "Internal server error",
        body: null,
      });
    });
  }

  public registerGlobalMiddlewares(): void {
    const hono = this.container.get<HonoProvider>(CONFIG.HonoProvider).app;
    const authMiddleware = this.container.get<AuthMiddleware>(
      CONFIG.AuthMiddleware
    );
    hono.use("*", authMiddleware.intercept);
  }

  public getApp() {
    return this.container.get<HonoProvider>(CONFIG.HonoProvider).app;
  }
}

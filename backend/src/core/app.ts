import "reflect-metadata";

import { Container } from "inversify";
import { Server } from "./server";
import { Router } from "./router";
import { CONFIG } from "../ioc/config";
import { Hono } from "hono";
import { HonoProvider } from "./hono-provider";
import { Controller } from "../controllers/controller";
import { AuthController } from "../controllers/auth-controller";
import { ServeStaticController } from "../controllers/serve-static-controller";
import { HTTPException } from "hono/http-exception";
import { IAuthStrategy } from "../interfaces/auth-strategy.interface";
import { JwtAuthStrategy } from "../services/auth/strategy/jwt.strategy";
import { AuthMiddleware } from "../middlewares/auth/auth.middleware";
import { UserRepository } from "../interfaces/user-repository.interface";
import { DbUserRepository } from "../repositories/db/user.repository";
import { PrismaProvider } from "../prisma/prisma";
import { JwtService } from "../services/auth/jwt.service";
import { AuthService } from "../services/auth/auth.service";
import { ZodValidationService } from "../services/zod-validation.service";
import { ResponseFormatterMiddleware } from "../middlewares/response-formatter.middleware";

import { ConnectionController } from "../controllers/connection.controller";
import { ConnectionService } from "../services/connection.service";
import { ConnectionRepository } from "../interfaces/connection-repository.interface";
import { DbConnectionRepository } from "../repositories/db/connection.repository";
import { ProfileService } from "../services/profile.service";

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

    console.log("Environment: ", process.env.ENVIRONMENT);
    if (process.env.ENVIRONMENT && process.env.ENVIRONMENT === "prod") {
      console.log("Production environment detected");
      this.container
        .bind<Controller>(CONFIG.Controllers)
        .to(ServeStaticController)
        .inSingletonScope();
    }

    this.container
      .bind<IAuthStrategy>(CONFIG.JwtAuthStrategy)
      .to(JwtAuthStrategy)
      .inSingletonScope();

    this.container
      .bind<AuthMiddleware>(CONFIG.AuthMiddleware)
      .to(AuthMiddleware);
    this.container
      .bind<ResponseFormatterMiddleware>(CONFIG.ResponseFormatterMiddleware)
      .to(ResponseFormatterMiddleware);

    this.container
      .bind<UserRepository>(CONFIG.UserRepository)
      .to(DbUserRepository);

    this.container
      .bind<PrismaProvider>(CONFIG.PrismaProvider)
      .to(PrismaProvider);

    this.container.bind<JwtService>(CONFIG.JwtService).to(JwtService);
    this.container.bind<AuthService>(CONFIG.AuthService).to(AuthService);
    this.container
      .bind<ZodValidationService>(CONFIG.ValidationService)
      .to(ZodValidationService);

    this.container
      .bind<Controller>(CONFIG.Controllers)
      .to(ConnectionController)
      .inSingletonScope();

    this.container
      .bind<ConnectionService>(CONFIG.ConnectionService)
      .to(ConnectionService)
      .inSingletonScope();

    this.container
      .bind<ProfileService>(CONFIG.ProfileService)
      .to(ProfileService)
      .inSingletonScope();

    this.container
      .bind<ConnectionRepository>(CONFIG.ConnectionRepository)
      .to(DbConnectionRepository);
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
      console.error(err);
      if (err instanceof HTTPException) {
        const formattedResponse = {
          success: false,
          message: err.message,
          body: null,
        };

        c.status(err.status);

        return c.json(formattedResponse);
      }

      c.status(500);

      return c.json({
        status: false,
        message: "Internal server error",
        body: null,
      });
    });
  }

  public registerGlobalMiddlewares(): void {
    const hono = this.container.get<HonoProvider>(CONFIG.HonoProvider).app;
    hono.use("*", async (c, next) => {
      console.log("in seeing the path");
      const path = c.req.path;
      const method = c.req.method;
      console.log(`{${method.toUpperCase()}} ${path}`);
      await next();
      console.log("out seeing the path");
    });

    const authMiddleware = this.container.get<AuthMiddleware>(
      CONFIG.AuthMiddleware
    );
    hono.use("*", authMiddleware.intercept);

    const responseFormatter = this.container.get<ResponseFormatterMiddleware>(
      CONFIG.ResponseFormatterMiddleware
    );
    hono.use("*", responseFormatter.intercept);
  }

  public getApp() {
    return this.container.get<HonoProvider>(CONFIG.HonoProvider).app;
  }
}

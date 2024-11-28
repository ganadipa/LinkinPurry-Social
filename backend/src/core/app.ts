import "reflect-metadata";

import { Server } from "./server";
import { Router } from "./router";
import { CONFIG } from "../ioc/config";
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
import { ProfileController } from "../controllers/profile.controller";
import { FeedRepository } from "../interfaces/feed-repository.interface";
import { DbFeedRepository } from "../repositories/db/feed.repository";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { IOCContainer } from "../ioc/container";

export class Application {
  private ioc: IOCContainer;
  private configurator: any;

  constructor() {
    this.ioc = IOCContainer.getInstance();
    this.configurator = new MainBindingConfigurator(this.ioc);
    this.configurator.configure();
    this.initializeContainer();
  }

  private initializeContainer(): void {}

  public start(port: number): void {
    const server = this.ioc.get<Server>(CONFIG.Server);
    const router = this.ioc.get<Router>(CONFIG.Router);
    server.start(port);

    router.registerMiddlewaresBeforeGlobal();
    this.registerGlobalMiddlewares();
    router.registerMiddlewaresAfterGlobal();
    router.registerRoutes();

    this.configureHono();
  }

  public configureHono(): void {
    const hono = this.ioc.get<HonoProvider>(CONFIG.HonoProvider).app;

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
    const hono = this.ioc.get<HonoProvider>(CONFIG.HonoProvider).app;
    hono.use("*", async (c, next) => {
      console.log("in seeing the path");
      const path = c.req.path;
      const method = c.req.method;
      console.log(`{${method.toUpperCase()}} ${path}`);
      await next();
      console.log("out seeing the path");
    });

    const authMiddleware = this.ioc.get<AuthMiddleware>(CONFIG.AuthMiddleware);
    hono.use("*", authMiddleware.intercept);
  }

  public getApp() {
    return this.ioc.get<HonoProvider>(CONFIG.HonoProvider).app;
  }
}

class MainBindingConfigurator {
  constructor(private readonly ioc: IOCContainer) {}

  public get<T>(serviceIdentifier: symbol): T {
    return this.ioc.get<T>(serviceIdentifier);
  }

  public configure(): void {
    this.configureProviders();
    this.configureServer();
    this.configureRouter();
    this.configureControllers();
    this.configureAuthStrategy();
    this.configureMiddlewares();
    this.configureRepositories();
    this.configureServices();
  }

  private configureControllers(): void {
    // Register all controllers here
    this.ioc.bind<Controller>(CONFIG.Controllers, AuthController);
    this.ioc.bind<Controller>(CONFIG.Controllers, UserController);
    this.ioc.bind<Controller>(CONFIG.Controllers, ProfileController);
    this.ioc.bind<Controller>(CONFIG.Controllers, ServeStaticController);
    this.ioc.bind<Controller>(CONFIG.Controllers, ConnectionController);
  }

  private configureProviders(): void {
    // Register Providers
    this.ioc.bind<HonoProvider>(CONFIG.HonoProvider, HonoProvider);
    this.ioc.bind<PrismaProvider>(CONFIG.PrismaProvider, PrismaProvider);
  }

  private configureServer(): void {
    // Register Server
    this.ioc.bind<Server>(CONFIG.Server, Server);
  }

  private configureRouter(): void {
    // Register Router
    this.ioc.bind<Router>(CONFIG.Router, Router);
  }

  private configureAuthStrategy(): void {
    // Register AuthStrategy
    this.ioc.bind<IAuthStrategy>(CONFIG.JwtAuthStrategy, JwtAuthStrategy);
  }

  private configureMiddlewares(): void {
    // Register all middlewares here
    this.ioc.bind<AuthMiddleware>(CONFIG.AuthMiddleware, AuthMiddleware);
    this.ioc.bind<ResponseFormatterMiddleware>(
      CONFIG.ResponseFormatterMiddleware,
      ResponseFormatterMiddleware
    );
  }

  private configureRepositories(): void {
    // Register all repositories here
    this.ioc.bind<UserRepository>(CONFIG.DbUserRepository, DbUserRepository);
    this.ioc.bind<FeedRepository>(CONFIG.DbFeedRepository, DbFeedRepository);
    this.ioc.bind<ConnectionRepository>(
      CONFIG.DbConnectionRepository,
      DbConnectionRepository
    );
  }

  private configureServices(): void {
    // Register all services here
    this.ioc.bind<JwtService>(CONFIG.JwtService, JwtService);
    this.ioc.bind<AuthService>(CONFIG.AuthService, AuthService);
    this.ioc.bind<ZodValidationService>(
      CONFIG.ZodValidationService,
      ZodValidationService
    );
    this.ioc.bind<UserService>(CONFIG.UserService, UserService);
    this.ioc.bind<ProfileService>(CONFIG.ProfileService, ProfileService);
    this.ioc.bind<ConnectionService>(
      CONFIG.ConnectionService,
      ConnectionService
    );
  }
}

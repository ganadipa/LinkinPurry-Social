import { inject, injectable } from "inversify";
import { Controller } from "./controller";
import { CONFIG } from "../ioc/config";
import { HonoProvider, OpenApiHonoProvider } from "../core/hono-provider";
import { AuthService } from "../services/auth/auth.service";
import { ZodValidationService } from "../services/zod-validation.service";
import {
  LoginPayload,
  LoginPayloadSchema,
  RegisterPayloadSchema,
} from "../constants/request-payload";
import { IAuthStrategy } from "../interfaces/auth-strategy.interface";
import { deleteCookie, setCookie } from "hono/cookie";
import { BadRequestException } from "../exceptions/bad-request.exception";
import { InternalErrorException } from "../exceptions/internal-error.exception";
import { HTTPException } from "hono/http-exception";
import { createMiddleware } from "hono/factory";
import { createRoute } from "@hono/zod-openapi";
import { ErrorResponseSchema } from "../constants/types";
import { LoginEnv } from "../constants/context-env.types";
import { RegisterEnv } from "../constants/context-env.types";
import {
  LoginSuccessSchema,
  LogoutSuccessSchema,
  MeSuccessSchema,
} from "../constants/response-body";

@injectable()
export class AuthController implements Controller {
  constructor(
    @inject(CONFIG.OpenApiHonoProvider) private hono: OpenApiHonoProvider,
    @inject(CONFIG.AuthService) private readonly authService: AuthService,
    @inject(CONFIG.ZodValidationService)
    private readonly zodValidationService: ZodValidationService,
    @inject(CONFIG.AuthStrategy) private readonly authStrategy: IAuthStrategy
  ) {}

  public registerMiddlewaresbeforeGlobal(): void {}

  public registerMiddlewaresAfterGlobal(): void {}

  public registerRoutes(): void {
    this.registerLoginRoute();
    this.registerLogoutRoute();
    this.registerMeRoute();
    this.registerRegisterRoute();
  }

  private setLoginPayloadMiddleware = createMiddleware<LoginEnv>(
    async (c, next) => {
      const payload = await c.req.json();
      this.zodValidationService.validate(payload, LoginPayloadSchema);
      c.set("loginPayload", payload);
      return next();
    }
  );

  private setRegisterPayloadMiddleware = createMiddleware<RegisterEnv>(
    async (c, next) => {
      const payload = await c.req.json();
      this.zodValidationService.validate(payload, RegisterPayloadSchema);
      c.set("registerPayload", payload);
      return next();
    }
  );

  private registerLoginRoute() {
    const route = createRoute({
      middleware: [this.setLoginPayloadMiddleware] as const,
      method: "post",
      path: "/api/login",
      security: [{ BearerAuth: [] }],
      request: {
        body: {
          content: {
            "application/json": {
              schema: LoginPayloadSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: "Successful login",
          content: {
            "application/json": {
              schema: LoginSuccessSchema,
            },
          },
        },
        400: {
          description: "Bad request",
          content: {
            "application/json": {
              schema: ErrorResponseSchema,
            },
          },
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: ErrorResponseSchema,
            },
          },
        },
      },
    });

    this.hono.app.openapi(route, async (c) => {
      try {
        console.log("login route");
        const payload = c.var.loginPayload;
        const user = c.var.user;
        let token;

        console.log("login route1");
        if (!user) {
          console.log("here");
          console.log(payload);
          token = await this.authService.login(payload);
          console.log("her2");
        } else {
          if (!user.id) {
            throw new InternalErrorException(
              "User from the repo somehow does not have an ID"
            );
          }

          token = await this.authService.login(payload);
        }
        console.log("login route2");

        const tokenPayload = this.authStrategy.getPayload(token);
        if (!tokenPayload) {
          throw new BadRequestException("Invalid token");
        }

        const { iat, exp } = tokenPayload;

        setCookie(c, "authorization", token, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: exp - iat,
        });
        console.log("login route3");

        return c.json(
          {
            success: true as const,
            message: "Successfully logged in",
            body: {
              token,
            },
          },
          200
        );
      } catch (exception) {
        if (exception instanceof HTTPException) {
          let status: 400 | 500;

          switch (exception.status) {
            case 400:
              status = 400;
              break;
            default:
              status = 500;
              break;
          }

          c.status(status);
          return c.json(
            {
              success: false as const,
              message: exception.message,
              error: null,
            },
            status
          );
        }

        c.status(500);
        return c.json(
          {
            success: false as const,
            message: "Internal server error",
            error: null,
          },
          500
        );
      }
    });
  }

  private registerLogoutRoute() {
    const route = createRoute({
      method: "post",
      path: "/api/logout",
      responses: {
        200: {
          description: "Successfully logged out",
          content: {
            "application/json": {
              schema: LogoutSuccessSchema,
            },
          },
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: ErrorResponseSchema,
            },
          },
        },
      },
    });

    this.hono.app.openapi(route, async (c) => {
      try {
        deleteCookie(c, "authorization");
        return c.json(
          {
            success: true as const,
            message: "Successfully logged out",
            body: null,
          },
          200
        );
      } catch (exception) {
        return c.json(
          {
            success: false as const,
            message: "Internal server error",
            error: null,
          },
          500
        );
      }
    });
  }
  private registerMeRoute() {
    const route = createRoute({
      method: "get",
      path: "/api/me",
      security: [{ BearerAuth: [] }],
      responses: {
        200: {
          description: "User info retrieved",
          content: {
            "application/json": {
              schema: MeSuccessSchema,
            },
          },
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: ErrorResponseSchema,
            },
          },
        },
      },
    });

    this.hono.app.openapi(route, async (c) => {
      try {
        const user = c.var.user;
        if (!user) {
          return c.json(
            {
              success: true as const,
              message: "No user found",
              body: null,
            },
            200
          );
        }

        if (!user.id) {
          throw new InternalErrorException(
            "User from the repo somehow does not have an ID"
          );
        }
        return c.json(
          {
            success: true as const,
            message: "User found",
            body: {
              id: Number(user.id),
              email: user.email,
              name: user.full_name,
              username: user.username,
            },
          },
          200
        );
      } catch (exception) {
        if (exception instanceof HTTPException) {
          let status: 500;
          switch (exception.status) {
            default:
              status = 500;
              break;
          }

          return c.json(
            {
              success: false as const,
              message: exception.message,
              error: null,
            },
            status
          );
        }

        return c.json(
          {
            success: false as const,
            message: "Internal server error",
            error: null,
          },
          500
        );
      }
    });
  }

  private registerRegisterRoute() {
    const route = createRoute({
      middleware: [this.setRegisterPayloadMiddleware] as const,
      method: "post",
      path: "/api/register",
      request: {
        body: {
          content: {
            "application/json": {
              schema: RegisterPayloadSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: "Successfully registered",
          content: {
            "application/json": {
              schema: LoginSuccessSchema, // Using LoginSuccessSchema since it returns a token
            },
          },
        },
        400: {
          description: "Bad request",
          content: {
            "application/json": {
              schema: ErrorResponseSchema,
            },
          },
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: ErrorResponseSchema,
            },
          },
        },
      },
    });

    this.hono.app.openapi(route, async (c) => {
      try {
        const payload = c.var.registerPayload;
        const token = await this.authService.register(payload);

        return c.json(
          {
            success: true as const,
            message: "Successfully registered",
            body: {
              token,
            },
          },
          200
        );
      } catch (exception) {
        if (exception instanceof HTTPException) {
          let status: 400 | 500;
          switch (exception.status) {
            case 400:
              status = 400;
              break;
            default:
              status = 500;
              break;
          }

          return c.json(
            {
              success: false as const,
              message: exception.message,
              error: null,
            },
            status
          );
        }

        return c.json(
          {
            success: false as const,
            message: "Internal server error",
            error: null,
          },
          500
        );
      }
    });
  }
}

import { inject, injectable } from "inversify";
import { Controller } from "./controller";
import { CONFIG } from "../ioc/config";
import { HonoProvider } from "../core/hono-provider";
import { AuthService } from "../services/auth/auth.service";
import { ValidationService } from "../services/validation.service";
import {
  LoginPayload,
  loginPayloadChecker,
  registerPayloadChecker,
} from "../constants/request-payload";
import { IAuthStrategy } from "../interfaces/auth-strategy.interface";
import { deleteCookie, setCookie } from "hono/cookie";
import { BadRequestException } from "../exceptions/bad-request.exception";
import { InternalErrorException } from "../exceptions/internal-error.exception";
import { HTTPException } from "hono/http-exception";

@injectable()
export class AuthController implements Controller {
  constructor(
    @inject(CONFIG.HonoProvider) private hono: HonoProvider,
    @inject(CONFIG.AuthService) private readonly authService: AuthService,
    @inject(CONFIG.ValidationService)
    private readonly validationService: ValidationService,
    @inject(CONFIG.AuthStrategy) private readonly authStrategy: IAuthStrategy
  ) {}

  public registerMiddlewaresbeforeGlobal(): void {}

  public registerMiddlewaresAfterGlobal(): void {
    this.hono.app.post("/api/login", async (c, next) => {
      const payload = await c.req.json();
      this.validationService.validate(payload, loginPayloadChecker);
      await next();
    });

    this.hono.app.post("/api/register", async (c, next) => {
      const payload = await c.req.json();
      this.validationService.validate(payload, registerPayloadChecker);
      await next();
    });
  }

  public registerRoutes(): void {
    this.hono.app.post("/api/login", async (c) => {
      const payload = (await c.req.json()) as LoginPayload;
      const user = c.var.user;
      console.log("user", user);
      let token;
      if (!user) {
        token = await this.authService.login(payload);
      } else {
        if (!user.id) {
          throw new InternalErrorException(
            "User from the repo somehow does not have an ID"
          );
        }

        token = await this.authService.login(payload);
      }

      const tokenPayload = this.authStrategy.getPayload(token);
      if (!tokenPayload) {
        throw new BadRequestException("Invalid token");
      }

      const { iat, exp } = tokenPayload;
      console.log(tokenPayload);

      setCookie(c, "authorization", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: exp - iat,
      });

      return c.json({
        success: true,
        message: "Successfully logged in",
        body: {
          token,
        },
      });
    });

    this.hono.app.post("/api/register", async (c) => {
      try {
        const payload = await c.req.json();
        const token = await this.authService.register(payload);

        return c.json({
          success: true,
          message: "Successfully registered",
          body: {
            token,
          },
        });
      } catch (exception) {
        console.log(exception);
        if (exception instanceof HTTPException) {
          throw exception;
        }
        throw new InternalErrorException("Error registering user");
      }
    });

    this.hono.app.get("/api/me", async (c) => {
      const user = c.var.user;
      console.log("user", user);
      if (!user) {
        return c.json({
          success: true,
          message: "No user found",
          body: null,
        });
      }

      return c.json({
        success: true,
        message: "User found",
        body: {
          id: user.id === undefined ? undefined : Number(user.id),
          email: user.email,
          name: user.full_name,
          username: user.username,
        },
      });
    });

    this.hono.app.post("/api/logout", async (c) => {
      deleteCookie(c, "authorization");
      return c.json({
        success: true,
        message: "Successfully logged out",
        body: null,
      });
    });
  }
}

import { inject, injectable } from "inversify";
import { Controller } from "./controller";
import { CONFIG } from "../ioc/config";
import { HonoProvider } from "../core/hono-provider";
import { AuthService } from "../services/auth/auth.service";
import { ValidationService } from "../services/validation.service";
import {
  loginPayloadChecker,
  registerPayloadChecker,
} from "../constants/request-payload";
import { IAuthStrategy } from "../interfaces/auth-strategy.interface";
import { setCookie } from "hono/cookie";
import { BadRequestException } from "../exceptions/bad-request.exception";
import { InternalErrorException } from "../exceptions/internal-error.exception";

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
      const user = c.var.user;
      let token;
      if (!user) {
        token = await this.authService.login(await c.req.json());
      } else {
        if (!user.id) {
          throw new InternalErrorException(
            "User from the repo somehow does not have an ID"
          );
        }

        token = await this.authStrategy.getToken(
          user.id.toString(),
          user.email
        );
      }

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

      return c.json({ token });
    });

    this.hono.app.post("/api/register", async (c) => {
      const payload = await c.req.json();
      const token = this.authService.register(payload);
      return c.json({ token });
    });
  }
}

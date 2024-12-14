import { Context } from "hono";
import { inject, injectable } from "inversify";
import { CONFIG } from "../../ioc/config";
import { IAuthStrategy } from "../../interfaces/auth-strategy.interface";
import { createMiddleware } from "hono/factory";
import {
  getCookie,
  getSignedCookie,
  setCookie,
  setSignedCookie,
  deleteCookie,
} from "hono/cookie";

@injectable()
export class AuthMiddleware {
  constructor(
    @inject(CONFIG.AuthStrategy) private authStrategy: IAuthStrategy
  ) {}

  public intercept = createMiddleware(async (c, next) => {
    console.log("[AuthMiddleware] intercept");

    const token = getCookie(c, "token");
    if (!token) {
      c.set("user", null);
      await next();
      return;
    }

    const user = await this.authStrategy.validate(token);
    c.set("user", user);
    await next();
  });
}

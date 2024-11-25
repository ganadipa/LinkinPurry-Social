import { Context } from "hono";
import { inject, injectable } from "inversify";
import { CONFIG } from "../ioc/config";
import { createMiddleware } from "hono/factory";
import {
  getCookie,
  getSignedCookie,
  setCookie,
  setSignedCookie,
  deleteCookie,
} from "hono/cookie";

@injectable()
export class ResponseFormatterMiddleware {
  constructor() {}

  public intercept = createMiddleware(async (c, next) => {
    await next();

    const response = c.res.json();
    console.log(response);
  });
}

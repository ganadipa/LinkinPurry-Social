import { Context } from "hono";
import { inject, injectable } from "inversify";
import { CONFIG } from "../ioc/config";
import { createMiddleware } from "hono/factory";

@injectable()
export class ResponseFormatterMiddleware {
  constructor() {}

  public intercept = createMiddleware(async (c, next) => {
    console.log("in the response formatter middleware");
    await next();
    console.log("out the response formatter middleware");

    // const response = await c.res.json();
    // console.log("response is", response);
  });
}

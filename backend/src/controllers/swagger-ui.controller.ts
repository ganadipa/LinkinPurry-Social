import { inject, injectable } from "inversify";
import { CONFIG } from "../ioc/config";
import { OpenApiHonoProvider } from "../core/hono-provider";
import { swaggerUI } from "@hono/swagger-ui";
import { Controller } from "./controller";

@injectable()
export class SwaggerUIController implements Controller {
  constructor(
    @inject(CONFIG.OpenApiHonoProvider)
    private readonly hono: OpenApiHonoProvider
  ) {}

  public registerMiddlewaresbeforeGlobal(): void {}
  public registerMiddlewaresAfterGlobal(): void {}

  public registerRoutes(): void {
    // Serve Swagger UI
    this.hono.app.get(
      "/api/ui",
      swaggerUI({
        url: "/api/doc",
      })
    );

    // Serve OpenAPI schema
    this.hono.app.doc("/api/doc", {
      openapi: "3.0.0",
      info: {
        version: "1.0.0",
        title: "My API",
      },
    });
  }
}

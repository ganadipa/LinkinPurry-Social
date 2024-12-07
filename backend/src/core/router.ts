import { Controller } from "../controllers/controller";
import { injectable, inject, multiInject } from "inversify";
import { CONFIG } from "../ioc/config";

@injectable()
export class Router {
  constructor(
    @multiInject(CONFIG.Controllers) private controllers: Controller[]
  ) {}

  public registerRoutes(): void {
    this.controllers.forEach((controller) => controller.registerRoutes());
  }

  public registerMiddlewaresBeforeGlobal(): void {
    this.controllers.forEach((controller) =>
      controller.registerMiddlewaresbeforeGlobal()
    );
  }

  public registerMiddlewaresAfterGlobal(): void {
    this.controllers.forEach((controller) =>
      controller.registerMiddlewaresAfterGlobal()
    );
  }
}

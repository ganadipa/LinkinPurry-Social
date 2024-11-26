import { inject, injectable } from "inversify";
import { Controller } from "./controller";

@injectable()
export class ProfileController implements Controller {
  constructor() {}

  public registerMiddlewaresbeforeGlobal(): void {}

  public registerMiddlewaresAfterGlobal(): void {}

  public registerRoutes(): void {}
}

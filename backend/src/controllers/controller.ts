export interface Controller {
  registerRoutes(): void;
  registerMiddlewaresbeforeGlobal(): void;
  registerMiddlewaresAfterGlobal(): void;
}

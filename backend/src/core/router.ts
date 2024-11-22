import { Hono } from "hono";
import { Controller } from "./controller";

export class Router {
  constructor(private app: Hono, private controller: Controller) {}

  public registerRoutes(): void {
    this.app.get("/", this.controller.hello.bind(this.controller));
  }
}

import { inject, injectable } from "inversify";
import { Controller } from "./controller";
import { CONFIG } from "../ioc/config";
import { HonoProvider } from "../core/hono-provider";
import { ProfileService } from "../services/profile.service";

@injectable()
export class ProfileController implements Controller {
  constructor(
    @inject(CONFIG.HonoProvider) private hono: HonoProvider,
    @inject(CONFIG.ProfileService) private readonly profileService: ProfileService,
    
  ) {}

  public registerMiddlewaresbeforeGlobal(): void {}

  public registerMiddlewaresAfterGlobal(): void {}

  public registerRoutes(): void {}
}

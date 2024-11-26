import { inject, injectable } from "inversify";
import { Controller } from "./controller";
import { CONFIG } from "../ioc/config";
import { HonoProvider } from "../core/hono-provider";
import { ProfileService } from "../services/profile.service";
import { ZodValidationService } from "../services/zod-validation.service";

@injectable()
export class ProfileController implements Controller {
  constructor(
    @inject(CONFIG.HonoProvider) private hono: HonoProvider,
    @inject(CONFIG.ProfileService)
    private readonly profileService: ProfileService,
    @inject(CONFIG.ZodValidationService)
    private readonly zodValidationService: ZodValidationService
  ) {}

  public registerMiddlewaresbeforeGlobal(): void {}

  public registerMiddlewaresAfterGlobal(): void {}

  public registerRoutes(): void {
    this.hono.app.get("/api/profile/:user_id", async (c) => {
      const userId = c.req.param("user_id");
      const currentUser = c.var.user;
      const profileData = await this.profileService.getProfile(
        Number(userId),
        currentUser
      );

      return c.json({
        success: true,
        message: "Profile data retrieved",
        body: profileData,
      });
    });
  }
}

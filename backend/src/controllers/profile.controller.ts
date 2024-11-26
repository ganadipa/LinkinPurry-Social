import { inject, injectable } from "inversify";
import { Controller } from "./controller";
import { CONFIG } from "../ioc/config";
import { HonoProvider } from "../core/hono-provider";
import { ProfileService } from "../services/profile.service";
import { ZodValidationService } from "../services/zod-validation.service";
import { updateProfilePayloadSchema } from "../constants/request-payload";
import { InternalErrorException } from "../exceptions/internal-error.exception";
import { UnauthorizedException } from "../exceptions/unauthorized.exception";

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

  public registerMiddlewaresAfterGlobal(): void {
    this.hono.app.put("/api/profile/:user_id", async (c, next) => {
      const payload = await c.req.json();
      this.zodValidationService.validate(payload, updateProfilePayloadSchema);

      await next();
    });

    this.hono.app.put("/api/profile/:user_id", async (c, next) => {
      const user = c.var.user;
      if (!user) {
        throw new UnauthorizedException("Unauthorized access");
      }

      await next();
    });
  }

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

    this.hono.app.put("/api/profile/:user_id", async (c) => {
      const userId = c.req.param("user_id");
      console.log("userId", userId);
      const payload = await c.req.json();
      const parsed = updateProfilePayloadSchema.safeParse(payload);
      if (!parsed.success) {
        throw new InternalErrorException("There exist logic error");
      }

      const updateData = parsed.data;
      let updateUser = c.var.user;
      if (!updateUser) {
        throw new InternalErrorException("Something went wrong!");
      }

      updateUser.full_name = updateData.name ?? updateUser.full_name;
      updateUser.skills = updateData.skills ?? updateUser.skills;
      updateUser.work_history =
        updateData.work_history ?? updateUser.work_history;
      updateUser.username = updateData.username ?? updateUser.username;

      console.log("updateUser", updateUser);
      const profileData = await this.profileService.updateProfile(
        Number(userId),
        updateUser
      );

      return c.json({
        success: true,
        message: "Profile data updated",
        body: profileData,
      });
    });
  }
}

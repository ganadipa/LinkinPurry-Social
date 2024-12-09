import { inject, injectable } from "inversify";
import { Controller } from "./controller";
import { CONFIG } from "../ioc/config";
import { OpenApiHonoProvider } from "../core/hono-provider";
import { ProfileService } from "../services/profile.service";
import { InternalErrorException } from "../exceptions/internal-error.exception";
import { UnauthorizedException } from "../exceptions/unauthorized.exception";
import { UpdateProfileFormDataSchema } from "../constants/request-payload";
import { createMiddleware } from "hono/factory";
import { createRoute } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";
import { NullErrorResponseSchema } from "../constants/types";
import { z } from "zod";
import {
  GetAuthenticatedProfileSuccessSchema,
  GetPublicProfileSuccessSchema,
} from "../constants/response-body";
import {
  GetProfileURLParamSchema,
  UpdateProfileURLParamSchema,
} from "../schemas/profile.schema";
import { UpdateProfileEnv } from "../constants/context-env.types";
import { BadRequestException } from "../exceptions/bad-request.exception";
import { FileService } from "../services/file.service";
import { ForbiddenException } from "../exceptions/forbidden.exception";

@injectable()
export class ProfileController implements Controller {
  constructor(
    @inject(CONFIG.OpenApiHonoProvider) private hono: OpenApiHonoProvider,
    @inject(CONFIG.ProfileService)
    private readonly profileService: ProfileService,
    @inject(CONFIG.FileService) private readonly fileService: FileService
  ) {}

  public registerMiddlewaresbeforeGlobal(): void {}

  public registerMiddlewaresAfterGlobal(): void {}

  public registerRoutes(): void {
    this.registerGetProfileRoute();
    this.registerUpdateProfileRoute();
    this.registerDeleteProfilePhotoRoute();
  }

  private setUpdateProfilePayloadMiddleware =
    createMiddleware<UpdateProfileEnv>(async (c, next) => {
      const formData = await c.req.formData();
      const payload = {
        name: formData.get("name")?.toString(),
        username: formData.get("username")?.toString(),
        work_history: formData.get("work_history")?.toString(),
        skills: formData.get("skills")?.toString(),
        profile_photo: (formData.get("profile_photo") ?? undefined) as
          | File
          | undefined,
      };

      console.log(payload);

      UpdateProfileFormDataSchema.parse(payload);
      c.set("updateProfilePayload", payload);
      return next();
    });

  private registerGetProfileRoute() {
    const route = createRoute({
      method: "get",
      tags: ["Profile"],
      path: "/api/profile/{user_id}",
      security: [{ BearerAuth: [] }],
      request: {
        params: GetProfileURLParamSchema,
      },
      responses: {
        200: {
          description: "Profile data retrieved",
          content: {
            "application/json": {
              schema: z.union([
                GetPublicProfileSuccessSchema,
                GetAuthenticatedProfileSuccessSchema,
              ]),
            },
          },
        },
        400: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
      },
    });

    this.hono.app.openapi(route, async (c) => {
      try {
        const userId = c.req.param("user_id");
        const currentUser = c.var.user;
        const profileData = await this.profileService.getProfile(
          Number(userId),
          currentUser
        );

        return c.json(
          {
            success: true as const,
            message: "Profile data retrieved",
            body: profileData,
          },
          200
        );
      } catch (exception) {
        if (exception instanceof HTTPException) {
          let status: 400 | 500;
          switch (exception.status) {
            case 400:
              status = 400;
              break;
            default:
              status = 500;
              break;
          }

          return c.json(
            {
              success: false as const,
              message: exception.message,
              error: null,
            },
            status
          );
        }

        return c.json(
          {
            success: false as const,
            message: "Internal server error",
            error: null,
          },
          500
        );
      }
    });
  }

  private registerUpdateProfileRoute() {
    const route = createRoute({
      middleware: [this.setUpdateProfilePayloadMiddleware] as const,
      method: "put",
      tags: ["Profile"],

      path: "/api/profile/:user_id",
      security: [{ BearerAuth: [] }],
      request: {
        params: UpdateProfileURLParamSchema,
        body: {
          content: {
            "multipart/form-data": {
              schema: UpdateProfileFormDataSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: "Profile data updated",
          content: {
            "application/json": {
              schema: GetAuthenticatedProfileSuccessSchema,
            },
          },
        },
        400: {
          description: "Bad request",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
      },
    });

    this.hono.app.openapi(route, async (c) => {
      try {
        const userId = c.req.param("user_id");
        const payload = c.var.updateProfilePayload;
        const updateUser = c.var.user;

        if (!updateUser) {
          throw new UnauthorizedException("Unauthorized access");
        }

        const parsed = UpdateProfileFormDataSchema.safeParse(payload);
        if (!parsed.success) {
          throw new InternalErrorException("Invalid payload format");
        }

        let path: string | undefined;
        if (parsed.data.profile_photo) {
          path = await this.fileService.upload(
            parsed.data.profile_photo,
            FileService.Visibility.PUBLIC
          );

          if (
            updateUser.profile_photo_path &&
            updateUser.profile_photo_path !== "/default-profile-picture.jpg"
          ) {
            const the_photo = updateUser.profile_photo_path;
            console.log(the_photo);
            await this.fileService.delete(the_photo);
          }
        }

        const updateData = parsed.data;
        updateUser.full_name = updateData.name ?? updateUser.full_name;
        updateUser.skills = updateData.skills ?? updateUser.skills;
        updateUser.work_history =
          updateData.work_history ?? updateUser.work_history;
        updateUser.username = updateData.username ?? updateUser.username;
        updateUser.profile_photo_path = path ?? updateUser.profile_photo_path;

        if (updateUser.username.includes(" ")) {
          throw new BadRequestException("Username cannot contain spaces");
        }

        const profileData = await this.profileService.updateProfile(
          Number(userId),
          updateUser
        );

        return c.json(
          {
            success: true as const,
            message: "Profile data updated",
            body: profileData,
          },
          200
        );
      } catch (exception) {
        if (exception instanceof HTTPException) {
          let status: 400 | 401 | 500;
          switch (exception.status) {
            case 400:
              status = 400;
              break;
            case 401:
              status = 401;
              break;
            default:
              status = 500;
              break;
          }

          return c.json(
            {
              success: false as const,
              message: exception.message,
              error: null,
            },
            status
          );
        }

        return c.json(
          {
            success: false as const,
            message: "Internal server error",
            error: null,
          },
          500
        );
      }
    });
  }

  private registerDeleteProfilePhotoRoute() {
    const route = createRoute({
      method: "delete",
      tags: ["Profile"],
      path: "/api/profile/{user_id}/photo",
      security: [{ BearerAuth: [] }],
      request: {
        params: UpdateProfileURLParamSchema,
      },
      responses: {
        200: {
          description: "Profile photo deleted",
          content: {
            "application/json": {
              schema: GetAuthenticatedProfileSuccessSchema,
            },
          },
        },
        400: {
          description: "Bad request",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
      },
    });

    this.hono.app.openapi(route, async (c) => {
      try {
        const userId = c.req.param("user_id");
        const user_id = Number(userId);
        if (isNaN(user_id)) {
          throw new BadRequestException("Invalid user ID");
        }
        const updateUser = c.var.user;

        if (!updateUser) {
          throw new UnauthorizedException("Unauthorized access");
        }

        if (user_id !== Number(updateUser.id)) {
          throw new ForbiddenException("Unauthorized access");
        }

        if (
          updateUser.profile_photo_path &&
          updateUser.profile_photo_path !== "/default-profile-picture.jpg"
        ) {
          await this.fileService.delete(updateUser.profile_photo_path);
        }

        updateUser.profile_photo_path = "/default-profile-picture.jpg";

        const profileData = await this.profileService.updateProfile(
          Number(userId),
          updateUser
        );

        return c.json(
          {
            success: true as const,
            message: "Profile photo deleted",
            body: profileData,
          },
          200
        );
      } catch (exception) {
        if (exception instanceof HTTPException) {
          let status: 400 | 401 | 500;
          switch (exception.status) {
            case 400:
              status = 400;
              break;
            case 401:
              status = 401;
              break;
            default:
              status = 500;
              break;
          }

          return c.json(
            {
              success: false as const,
              message: exception.message,
              error: null,
            },
            status
          );
        }

        return c.json(
          {
            success: false as const,
            message: "Internal server error",
            error: null,
          },
          500
        );
      }
    });
  }
}

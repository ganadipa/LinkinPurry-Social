import { inject, injectable } from "inversify";
import { Controller } from "./controller";
import { CONFIG } from "../ioc/config";
import { OpenApiHonoProvider } from "../core/hono-provider";
import { ProfileService } from "../services/profile.service";
import { ZodValidationService } from "../services/zod-validation.service";
import { InternalErrorException } from "../exceptions/internal-error.exception";
import { UnauthorizedException } from "../exceptions/unauthorized.exception";
import { UpdateProfilePayloadSchema } from "../constants/request-payload";
import { createMiddleware } from "hono/factory";
import { createRoute } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";
import { ErrorResponseSchema } from "../constants/types";
import { z } from "zod";
import {
  GetAuthenticatedProfileSuccessSchema,
  GetPublicProfileSuccessSchema,
} from "../constants/response-body";
import {
  GetProfileURLParamSchema,
  UpdateProfileURLParamSchema,
} from "../schemas/profile.schema";

@injectable()
export class ProfileController implements Controller {
  constructor(
    @inject(CONFIG.OpenApiHonoProvider) private hono: OpenApiHonoProvider,
    @inject(CONFIG.ProfileService)
    private readonly profileService: ProfileService,
    @inject(CONFIG.ZodValidationService)
    private readonly zodValidationService: ZodValidationService
  ) {}

  public registerMiddlewaresbeforeGlobal(): void {}

  public registerMiddlewaresAfterGlobal(): void {}

  public registerRoutes(): void {
    this.registerGetProfileRoute();
    this.registerUpdateProfileRoute();
  }

  private setUpdateProfilePayloadMiddleware = createMiddleware(
    async (c, next) => {
      const payload = await c.req.json();
      this.zodValidationService.validate(payload, UpdateProfilePayloadSchema);
      c.set("updateProfilePayload", payload);
      return next();
    }
  );

  private registerGetProfileRoute() {
    const route = createRoute({
      method: "get",
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
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: ErrorResponseSchema,
            },
          },
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: ErrorResponseSchema,
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
          let status: 401 | 500;
          switch (exception.status) {
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

  private registerUpdateProfileRoute() {
    const route = createRoute({
      middleware: [this.setUpdateProfilePayloadMiddleware] as const,
      method: "put",
      path: "/api/profile/:user_id",
      security: [{ BearerAuth: [] }],
      request: {
        params: UpdateProfileURLParamSchema,
        body: {
          content: {
            "application/json": {
              schema: UpdateProfilePayloadSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: "Profile data updated",
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
          description: "Bad request",
          content: {
            "application/json": {
              schema: ErrorResponseSchema,
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: ErrorResponseSchema,
            },
          },
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: ErrorResponseSchema,
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

        const parsed = UpdateProfilePayloadSchema.safeParse(payload);
        if (!parsed.success) {
          throw new InternalErrorException("Invalid payload format");
        }

        const updateData = parsed.data;
        updateUser.full_name = updateData.name ?? updateUser.full_name;
        updateUser.skills = updateData.skills ?? updateUser.skills;
        updateUser.work_history =
          updateData.work_history ?? updateUser.work_history;
        updateUser.username = updateData.username ?? updateUser.username;

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
}

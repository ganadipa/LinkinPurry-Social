import { inject, injectable } from "inversify";
import { Controller } from "./controller";
import { CONFIG } from "../ioc/config";
import { OpenApiHonoProvider } from "../core/hono-provider";
import { createRoute } from "@hono/zod-openapi";
import { ContactsResponseSuccessSchema } from "../schemas/chat.schema";
import { ErrorResponseSchema } from "../constants/types";
import { UnauthorizedException } from "../exceptions/unauthorized.exception";
import { HTTPException } from "hono/http-exception";
import { ChatService } from "../services/chat.service";
import { InternalErrorException } from "../exceptions/internal-error.exception";

@injectable()
export class ChatController implements Controller {
  constructor(
    @inject(CONFIG.OpenApiHonoProvider) private hono: OpenApiHonoProvider,
    @inject(CONFIG.ChatService) private chatService: ChatService
  ) {}

  public registerMiddlewaresAfterGlobal(): void {}

  public registerMiddlewaresbeforeGlobal(): void {}

  public registerRoutes(): void {
    this.registerContacts();
  }

  public registerContacts(): void {
    const route = createRoute({
      method: "get",
      path: "/api/chat/contacts",
      security: [{ BearerAuth: [] }],
      responses: {
        200: {
          description: "Successful login",
          content: {
            "application/json": {
              schema: ContactsResponseSuccessSchema,
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
      const user = c.var.user;
      try {
        if (!user) {
          throw new UnauthorizedException(
            "You must be logged in to access this route"
          );
        }

        if (!user.id) {
          throw new InternalErrorException("User id not found");
        }

        const contacts = await this.chatService.getContactsByUserId(
          Number(user.id)
        );

        return c.json(
          {
            success: true as const,
            message: "Contacts fetched successfully",
            body: contacts,
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

          c.status(status);
          return c.json(
            {
              success: false as const,
              message: exception.message,
              error: null,
            },
            status
          );
        }

        c.status(500);
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

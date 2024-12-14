import { inject, injectable } from "inversify";
import { Controller } from "./controller";
import { CONFIG } from "../ioc/config";
import { OpenApiHonoProvider } from "../core/hono-provider";
import { createRoute, z } from "@hono/zod-openapi";
import {
  ContactsResponseSuccessSchema,
  GetChatToAContactParamSchema,
  MessageSocketSchema,
  MessagesSuccessResponseSchema,
} from "../schemas/chat.schema";
import { ErrorResponseSchema } from "../constants/types";
import { UnauthorizedException } from "../exceptions/unauthorized.exception";
import { HTTPException } from "hono/http-exception";
import { ChatService } from "../services/chat.service";
import { InternalErrorException } from "../exceptions/internal-error.exception";
import { createMiddleware } from "hono/factory";
import { BadRequestException } from "../exceptions/bad-request.exception";
import { ContactIdEnv } from "../constants/context-env.types";
import { SocketProvider } from "../core/ws-provider";
import { Chat } from "../models/chat.model";
import { NotificationService } from "../services/notification.service";
import { UserService } from "../services/user.service";

@injectable()
export class ChatController implements Controller {
  constructor(
    @inject(CONFIG.OpenApiHonoProvider) private hono: OpenApiHonoProvider,
    @inject(CONFIG.ChatService) private chatService: ChatService,
    @inject(CONFIG.SocketProvider) private socketProvider: SocketProvider,
    @inject(CONFIG.NotificationService)
    private notificationService: NotificationService,
    @inject(CONFIG.UserService) private userService: UserService
  ) {}

  public registerMiddlewaresAfterGlobal(): void {}

  public registerMiddlewaresbeforeGlobal(): void {}

  public registerRoutes(): void {
    this.registerContacts();
    this.registerMessagesInAContact();
    this.registerSocket();
  }

  private validateContactIdMiddleware = createMiddleware<ContactIdEnv>(
    async (c, next) => {
      try {
        const contactId = c.req.param("contactId");

        if (!contactId) {
          throw new BadRequestException(
            "Invalid parameters: contactId is required"
          );
        }

        const contactIdConstraint = z.string().transform((value) => {
          const parsed = parseInt(value);
          if (isNaN(parsed)) {
            throw new Error("Invalid contactId");
          }
          return parsed;
        });

        const contactIdValue = contactIdConstraint.parse(contactId);

        c.set("contactId", contactIdValue);
        await next();
      } catch (exception) {
        throw new BadRequestException("Invalid parameters");
      }
    }
  );

  public registerContacts(): void {
    const route = createRoute({
      method: "get",
      path: "/api/chat/contacts",
      tags: ["Chat"],
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
              schema: ErrorResponseSchema(z.null()),
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: ErrorResponseSchema(z.null()),
            },
          },
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: ErrorResponseSchema(z.null()),
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
        console.log(contacts);

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

  public registerMessagesInAContact(): void {
    const route = createRoute({
      method: "get",
      path: "/api/chat/{contactId}",
      middleware: [this.validateContactIdMiddleware] as const,
      request: {
        params: GetChatToAContactParamSchema,
      },
      tags: ["Chat"],

      responses: {
        200: {
          description: "Successful login",
          content: {
            "application/json": {
              schema: MessagesSuccessResponseSchema,
            },
          },
        },
        400: {
          description: "Bad request",
          content: {
            "application/json": {
              schema: ErrorResponseSchema(z.null()),
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: ErrorResponseSchema(z.null()),
            },
          },
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: ErrorResponseSchema(z.null()),
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

        const messages = await this.chatService.getChatToAContact(
          Number(user.id),
          Number(c.var.contactId)
        );

        return c.json(
          {
            success: true as const,
            message: "Messages fetched successfully.",
            body: messages,
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
  public registerSocket(): void {
    this.socketProvider.io.on("connection", (socket) => {
      console.log("New client connected", socket.id);

      socket.on("join_room", ({ roomName }) => {
        socket.join(roomName);
        console.log(`Socket ${socket.id} joined room: ${roomName}`);
      });

      socket.on("leave_room", ({ roomName }) => {
        socket.leave(roomName);
        console.log(`Socket ${socket.id} left room: ${roomName}`);
      });

      // Handle new messages
      socket.on("send_message", async (messageData: unknown) => {
        const expect = MessageSocketSchema.safeParse(messageData);
        if (!expect.success) {
          console.error("Failed to parse message:", expect.error);
          return;
        }

        const from_id = expect.data.sender;
        const to_id = expect.data.roomName
          .split("-")
          .find((id) => Number(id) !== from_id);
        if (!to_id) {
          console.error("Failed to parse message:", expect.error);
          return;
        }

        const chat = new Chat(from_id, Number(to_id), expect.data.content);
        const message = await this.chatService.addMessage(chat);
        const user = await this.userService.getUserById(from_id);

        if (!user) {
          throw new InternalErrorException("User not found");
        }

        if (!user.full_name) {
          throw new InternalErrorException("User full name not found");
        }

        if (!user.id) {
            throw new InternalErrorException("User id not found");
        }

        console.log("Sending chat notification to:", to_id);
        this.notificationService.sendChatNotification(
          Number(to_id),
          expect.data.content,
          user.full_name,
          Number(user.id),
        );

        if (!message.id) {
          console.error("Failed to save message to database");
          return;
        }

        if (!message.timestamp) {
          console.error("Failed to save message to database");
          return;
        }

        this.socketProvider.io.to(expect.data.roomName).emit("new_message", {
          id: Number(message.id),
          timestamp: message.timestamp?.getTime(),
          sender: Number(message.from_id),
          content: message.message,
          receiver: Number(message.to_id),
        });
      });

      socket.on("typing", ({ roomName, isTyping, userId }) => {
        console.log("Typing status:", {
          roomName,
          isTyping,
          userId,
          socketId: socket.id,
        });

        socket.to(roomName).emit("typing_status", { isTyping, userId });
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
      });
    });
  }
}

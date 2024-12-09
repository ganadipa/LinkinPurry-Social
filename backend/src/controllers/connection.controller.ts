import { inject, injectable } from "inversify";
import { Controller } from "./controller";
import { CONFIG } from "../ioc/config";
import { OpenApiHonoProvider } from "../core/hono-provider";
import { ConnectionService } from "../services/connection.service";
import { BadRequestException } from "../exceptions/bad-request.exception";
import { createRoute } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { NullErrorResponseSchema } from "../constants/types";
import {
  GetUsersResponseSchema,
  GetConnectionsResponseSchema,
  RequestConnectionSchema,
  RespondToConnectionRequestSchema,
  GetConnectionRequestsResponseSchema,
  UnconnectSchema,
  CheckConnectionRequestSchema,
  CheckConnectionResponseSchema,
  GetConnectionRequestsFromResponseSchema,
} from "../schemas/connection.schema";
import { URL_PUBLIC_UPLOADS } from "../constants/constants";

@injectable()
export class ConnectionController implements Controller {
  constructor(
    @inject(CONFIG.OpenApiHonoProvider) private hono: OpenApiHonoProvider,
    @inject(CONFIG.ConnectionService)
    private connectionService: ConnectionService
  ) {}

  public registerMiddlewaresbeforeGlobal(): void {}

  public registerMiddlewaresAfterGlobal(): void {}

  public registerRoutes(): void {
    // search users
    this.registerGetUsersRoute();
    // get all connections
    this.registerGetConnectionsRoute();
    // send connection request
    this.registerRequestConnectionRoute();
    // respond to connection request
    this.registerRespondToConnectionRequestRoute();
    // get all connection requests
    this.registerGetConnectionRequestsRoute();
    // unconnect
    this.registerUnconnectRoute();
    // check connection
    this.registerCheckConnectionRoute();
    // get all connection requests from current user
    this.registerGetConnectionRequestsFromRoute();
    this.registerGetConnectionStatusesRoute();
    this.registerCheckConnectionStatusRoute();
    this.registerConnectionRecommendationRoute();
  }

  // search users
  private registerGetUsersRoute() {
    const route = createRoute({
      method: "get",
      path: "/api/users",
      tags: ["Connection"],
      responses: {
        200: {
          description: "Users retrieved successfully",
          content: {
            "application/json": {
              schema: GetUsersResponseSchema,
            },
          },
        },
        400: {
          description: "Bad Request",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
        500: {
          description: "Internal Server Error",
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
        const searchQuery = c.req.query("search") || "";
        const users = await this.connectionService.searchUsers(searchQuery);

        const jsonFriendlyUsers = users.map((user) => ({
          ...user,
          id: Number(user.id),
          profile_photo_path: URL_PUBLIC_UPLOADS + user.profile_photo_path,
          username: user.username,
          email: user.email,
          name: user.full_name,
        }));

        return c.json(
          {
            success: true,
            message: "Users retrieved successfully",
            body: jsonFriendlyUsers,
          },
          200
        );
      } catch (exception) {
        return this.handleException(c, exception);
      }
    });
  }

  // get all connections
  private registerGetConnectionsRoute() {
    const route = createRoute({
      method: "get",
      path: "/api/connections",
      security: [{ BearerAuth: [] }],
      tags: ["Connection"],
      responses: {
        200: {
          description: "Connections retrieved successfully",
          content: {
            "application/json": {
              schema: GetConnectionsResponseSchema,
            },
          },
        },
        400: {
          description: "Bad Request",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
        500: {
          description: "Internal Server Error",
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
        const userIdQuery = c.req.query("user_id");
        const user = c.var.user;

        const targetUserId = userIdQuery
          ? BigInt(userIdQuery)
          : user?.id !== undefined
          ? BigInt(user.id)
          : undefined;

        if (!targetUserId) {
          throw new BadRequestException("User ID is undefined");
        }

        const connections = await this.connectionService.getConnections(
          targetUserId
        );

        const jsonFriendlyConnections = connections.map((conn) => ({
          ...conn,
          from_id: Number(conn.from_id),
          to_id: Number(conn.to_id),
        }));

        return c.json(
          {
            success: true,
            message: "Connections retrieved successfully",
            body: jsonFriendlyConnections,
          },
          200
        );
      } catch (exception) {
        return this.handleException(c, exception);
      }
    });
  }

  // send connection request
  private registerRequestConnectionRoute() {
    const route = createRoute({
      method: "post",
      tags: ["Connection"],

      path: "/api/connections/request",
      security: [{ BearerAuth: [] }],
      request: {
        body: {
          content: {
            "application/json": {
              schema: RequestConnectionSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: "Connection request sent successfully",
          content: {
            "application/json": {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
              }),
            },
          },
        },
        400: {
          description: "Bad Request",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
        500: {
          description: "Internal Server Error",
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
        const { to_id } = await c.req.json();
        const user = c.var.user;

        if (!user || user.id === undefined) {
          throw new BadRequestException(
            "User not found or user ID is undefined"
          );
        }

        if (BigInt(user.id) === BigInt(to_id)) {
          throw new BadRequestException(
            "You cannot send a connection request to yourself"
          );
        }

        const from_id = BigInt(user.id);
        await this.connectionService.sendConnectionRequest(
          from_id,
          BigInt(to_id)
        );

        return c.json(
          {
            success: true,
            message: "Connection request sent successfully",
          },
          200
        );
      } catch (exception) {
        return this.handleException(c, exception);
      }
    });
  }

  // respond to connection request
  private registerRespondToConnectionRequestRoute() {
    const route = createRoute({
      method: "patch",
      path: "/api/connections/requests/{from_id}",
      security: [{ BearerAuth: [] }],
      request: {
        body: {
          content: {
            "application/json": {
              schema: RespondToConnectionRequestSchema,
            },
          },
        },
      },
      tags: ["Connection"],

      responses: {
        200: {
          description: "Connection request responded successfully",
          content: {
            "application/json": {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
              }),
            },
          },
        },
        400: {
          description: "Bad Request",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
        500: {
          description: "Internal Server Error",
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
        const { action } = await c.req.json();
        const from_id = BigInt(c.req.param("from_id"));
        const user = c.var.user;

        if (!user || user.id === undefined) {
          throw new BadRequestException(
            "User not found or user ID is undefined"
          );
        }

        const to_id = BigInt(user.id);

        if (!["accept", "reject"].includes(action)) {
          throw new BadRequestException(
            "Invalid action. Use 'accept' or 'reject'."
          );
        }

        await this.connectionService.respondToConnectionRequest(
          from_id,
          to_id,
          action
        );

        return c.json(
          {
            success: true,
            message: `Connection request ${action}ed successfully`,
          },
          200
        );
      } catch (exception) {
        return this.handleException(c, exception);
      }
    });
  }

  // get all connection requests
  private registerGetConnectionRequestsRoute() {
    const route = createRoute({
      method: "get",
      path: "/api/connections/requests",
      security: [{ BearerAuth: [] }],
      tags: ["Connection"],

      responses: {
        200: {
          description: "Connection requests retrieved successfully",
          content: {
            "application/json": {
              schema: GetConnectionRequestsResponseSchema,
            },
          },
        },
        400: {
          description: "Bad Request",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
        500: {
          description: "Internal Server Error",
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
        const user = c.var.user;

        if (!user || user.id === undefined) {
          throw new BadRequestException(
            "User not found or user ID is undefined"
          );
        }

        const userId = BigInt(user.id);
        const requests = await this.connectionService.getConnectionRequests(
          userId
        );

        const jsonFriendlyRequests = requests.map((req) => ({
          ...req,
          from_id: Number(req.from_id),
          to_id: Number(req.to_id),
        }));

        return c.json(
          {
            success: true,
            message: "Connection requests retrieved successfully",
            body: jsonFriendlyRequests,
          },
          200
        );
      } catch (exception) {
        return this.handleException(c, exception);
      }
    });
  }

  // unconnect
  private registerUnconnectRoute() {
    const route = createRoute({
      method: "delete",
      path: "/api/connections/{user_id}",
      security: [{ BearerAuth: [] }],
      tags: ["Connection"],

      responses: {
        200: {
          description: "Connection removed successfully",
          content: {
            "application/json": {
              schema: UnconnectSchema,
            },
          },
        },
        400: {
          description: "Bad Request",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
        500: {
          description: "Internal Server Error",
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
        const to_id = BigInt(c.req.param("user_id"));
        const user = c.var.user;

        if (!user || user.id === undefined) {
          throw new BadRequestException(
            "User not found or user ID is undefined"
          );
        }

        const from_id = BigInt(user.id);

        await this.connectionService.unconnect(from_id, to_id);

        return c.json(
          {
            success: true,
            message: "Connection removed successfully",
          },
          200
        );
      } catch (exception) {
        return this.handleException(c, exception);
      }
    });
  }

  // check connection
  private registerCheckConnectionRoute() {
    const route = createRoute({
      method: "post",
      path: "/api/connection/check",
      security: [{ BearerAuth: [] }],
      tags: ["Connection"],

      request: {
        body: {
          content: {
            "application/json": {
              schema: CheckConnectionRequestSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: "Connection checked successfully",
          content: {
            "application/json": {
              schema: CheckConnectionResponseSchema,
            },
          },
        },
        400: {
          description: "Bad Request",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
        500: {
          description: "Internal Server Error",
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
        const { from_id, to_id } = await c.req.json();
        const connection = await this.connectionService.checkConnection(
          from_id,
          to_id
        );

        return c.json(
          {
            success: true,
            message: "Connection checked successfully",
            body: {
              connected: connection,
            },
          },
          200
        );
      } catch (exception) {
        return this.handleException(c, exception);
      }
    });
  }

  // get all connection requests from current user
  private registerGetConnectionRequestsFromRoute() {
    const route = createRoute({
      method: "get",
      path: "/api/connections/requests-from",
      security: [{ BearerAuth: [] }],
      tags: ["Connection"],

      responses: {
        200: {
          description:
            "Connection requests from the current user retrieved successfully",
          content: {
            "application/json": {
              schema: GetConnectionRequestsFromResponseSchema,
            },
          },
        },
        400: {
          description: "Bad Request",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
        500: {
          description: "Internal Server Error",
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
        const user = c.var.user;

        if (!user || user.id === undefined) {
          throw new BadRequestException(
            "User not found or user ID is undefined"
          );
        }

        const userId = BigInt(user.id);
        const requests = await this.connectionService.getConnectionRequestsFrom(
          userId
        );

        const jsonFriendlyRequests = requests.map((req) => ({
          ...req,
          from_id: Number(req.from_id),
          to_id: Number(req.to_id),
        }));

        return c.json(
          {
            success: true,
            message:
              "Connection requests from this user retrieved successfully",
            body: jsonFriendlyRequests,
          },
          200
        );
      } catch (exception) {
        return this.handleException(c, exception);
      }
    });
  }

  private registerGetConnectionStatusesRoute() {
    const route = createRoute({
      method: "post",
      path: "/api/connections/statuses",
      security: [{ BearerAuth: [] }],
      tags: ["Connection"],
      request: {
        body: {
          content: {
            "application/json": {
              schema: z.object({
                userIds: z.array(z.number()), // Array of user IDs to check status
              }),
            },
          },
        },
      },
      responses: {
        200: {
          description: "Connection statuses retrieved successfully",
          content: {
            "application/json": {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                body: z.array(
                  z.object({
                    userId: z.number(),
                    status: z.enum(["connected", "pending", "not_connected"]),
                  })
                ),
              }),
            },
          },
        },
        400: {
          description: "Bad Request",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
        500: {
          description: "Internal Server Error",
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
        const { userIds } = await c.req.json();
        const currentUser = c.var.user;

        if (!currentUser || !currentUser.id) {
          throw new BadRequestException(
            "User not found or user ID is undefined"
          );
        }

        const statuses = await this.connectionService.getConnectionStatuses(
          BigInt(currentUser.id),
          userIds
        );

        return c.json(
          {
            success: true,
            message: "Connection statuses retrieved successfully",
            body: statuses,
          },
          200
        );
      } catch (exception) {
        return this.handleException(c, exception);
      }
    });
  }

  private registerCheckConnectionStatusRoute() {
    const route = createRoute({
      method: "get",
      path: "/api/connections/status/{userId}",
      security: [{ BearerAuth: [] }],
      tags: ["Connection"],
      responses: {
        200: {
          description: "Connection status retrieved successfully",
          content: {
            "application/json": {
              schema: z.object({
                success: z.boolean(),
                message: z.string(),
                body: z.object({
                  userId: z.number(),
                  status: z.enum(["connected", "pending", "not_connected"]),
                }),
              }),
            },
          },
        },
        400: {
          description: "Bad Request",
          content: {
            "application/json": {
              schema: NullErrorResponseSchema,
            },
          },
        },
        500: {
          description: "Internal Server Error",
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
        const userId = parseInt(c.req.param("userId"), 10);
        const currentUser = c.var.user;

        if (!currentUser || !currentUser.id) {
          throw new BadRequestException(
            "User not found or user ID is undefined"
          );
        }

        const status = await this.connectionService.getConnectionStatus(
          BigInt(currentUser.id),
          BigInt(userId)
        );

        return c.json(
          {
            success: true,
            message: "Connection status retrieved successfully",
            body: {
              userId,
              status,
            },
          },
          200
        );
      } catch (exception) {
        return this.handleException(c, exception);
      }
    });
  }

  private handleException(c: any, exception: any) {
    if (exception instanceof HTTPException) {
      return c.json(
        {
          success: false,
          message: exception.message,
          error: null,
        },
        exception.status
      );
    }

    return c.json(
      {
        success: false,
        message: "Internal Server Error",
        error: null,
      },
      500
    );
  }

  private registerConnectionRecommendationRoute() {
    const route = createRoute({
      method: "get",
      path: "/api/connections/recommendations",
      tags: ["Connection"],
      responses: {
        200: {
          description: "Recommendations retrieved successfully",
          content: {
            "application/json": {
              schema: GetUsersResponseSchema,
            },
          },
        },
        400: {
          description: "Bad Request",
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
          description: "Internal Server Error",
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
        const user = c.var.user;

        if (!user || user.id === undefined) {
          throw new BadRequestException(
            "User not found or user ID is undefined"
          );
        }

        const userId = BigInt(user.id);
        const recommendations =
          await this.connectionService.getConnectionRecommendations(userId);

        const jsonFriendlyRecommendations = recommendations.map((user) => {
          return {
            id: Number(user.id),
            name: user.full_name,
            email: user.email,
            username: user.username,
            profile_photo_path: URL_PUBLIC_UPLOADS + user.profile_photo_path,
          };
        });

        return c.json(
          {
            success: true,
            message: "Recommendations retrieved successfully",
            body: jsonFriendlyRecommendations,
          },
          200
        );
      } catch (exception) {
        return this.handleException(c, exception);
      }
    });
  }
}

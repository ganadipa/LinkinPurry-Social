import { inject, injectable } from "inversify";
import { Controller } from "./controller";
import { CONFIG } from "../ioc/config";
import { HonoProvider } from "../core/hono-provider";
import { ConnectionService } from "../services/connection.service";
import { BadRequestException } from "../exceptions/bad-request.exception";
import { ZodValidationService } from "../services/zod-validation.service";
import { fromId_toIdSchema } from "../constants/request-payload";

@injectable()
export class ConnectionController implements Controller {
  constructor(
    @inject(CONFIG.HonoProvider) private hono: HonoProvider,
    @inject(CONFIG.ConnectionService)
    private connectionService: ConnectionService,
    @inject(CONFIG.ZodValidationService)
    private zodValidationService: ZodValidationService
  ) {}

  public registerMiddlewaresbeforeGlobal(): void {}

  public registerMiddlewaresAfterGlobal(): void {
    this.hono.app.post("/api/connection/check", async (c, next) => {
      const payload = await c.req.json();
      this.zodValidationService.validate(payload, fromId_toIdSchema);
      await next();
    });
  }

  public registerRoutes(): void {
    // search users
    this.hono.app.get("/api/users", async (c) => {
      const searchQuery = c.req.query("search") || "";
      console.log("searchQuery: ", searchQuery); // debug
      const users = await this.connectionService.searchUsers(searchQuery);

      const jsonFriendlyUsers = users.map((user) => {
        return {
          ...user,
          id: Number(user.id),
        };
      });

      console.log("jsonFriendlyUsers: ", jsonFriendlyUsers); // debug

      return c.json({
        success: true,
        message: "Users retrieved successfully",
        body: jsonFriendlyUsers,
      });
    });

    // get connections
    this.hono.app.get("/api/connections", async (c) => {
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

      return c.json({
        success: true,
        message: "Connections retrieved successfully",
        body: jsonFriendlyConnections,
      });
    });

    // send connection request
    this.hono.app.post("/api/connections/request", async (c) => {
      const { to_id } = await c.req.json();
      const user = c.var.user;
      if (!user || user.id === undefined) {
        throw new BadRequestException("User not found or user ID is undefined");
      }
      const from_id = BigInt(user.id);

      if (!to_id) {
        throw new BadRequestException("Missing 'to_id' in request body");
      }

      await this.connectionService.sendConnectionRequest(
        from_id,
        BigInt(to_id)
      );
      return c.json({
        success: true,
        message: "Connection request sent successfully",
      });
    });

    // respond to connection request
    this.hono.app.patch("/api/connections/requests/:from_id", async (c) => {
      const { action } = await c.req.json();
      const from_id = BigInt(c.req.param("from_id"));
      const user = c.var.user;
      if (!user || user.id === undefined) {
        throw new BadRequestException("User not found or user ID is undefined");
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
      return c.json({
        success: true,
        message: `Connection request ${action}ed successfully`,
      });
    });

    // get connection requests
    this.hono.app.get("/api/connections/requests", async (c) => {
      const user = c.var.user;
      if (!user || user.id === undefined) {
        throw new BadRequestException("User not found or user ID is undefined");
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

      return c.json({
        success: true,
        message: "Connection requests retrieved successfully",
        body: jsonFriendlyRequests,
      });
    });

    // unconnect
    this.hono.app.delete("/api/connections/:user_id", async (c) => {
      const to_id = BigInt(c.req.param("user_id"));
      const user = c.var.user;
      if (!user || user.id === undefined) {
        throw new BadRequestException("User not found or user ID is undefined");
      }
      const from_id = BigInt(user.id);

      await this.connectionService.unconnect(from_id, to_id);
      return c.json({
        success: true,
        message: "Connection removed successfully",
      });
    });

    // check connection
    this.hono.app.post("/api/connection/check", async (c) => {
      const { from_id, to_id } = await c.req.json();
      const connection = await this.connectionService.checkConnection(
        from_id,
        to_id
      );
      return c.json({
        success: true,
        message: "Connection checked successfully",
        body: {
          connected: connection,
        },
      });
    });

    // get connection requests from current user
    this.hono.app.get("/api/connections/requests-from", async (c) => {
      const user = c.var.user;
      if (!user || user.id === undefined) {
        throw new BadRequestException("User not found or user ID is undefined");
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

      return c.json({
        success: true,
        message: "Connection requests from this user retrieved successfully",
        body: jsonFriendlyRequests,
      });
    });
  }
}

import { inject, injectable } from "inversify";
import { Controller } from "./controller";
import { CONFIG } from "../ioc/config";
import { HonoProvider } from "../core/hono-provider";
import { ConnectionService } from "../services/connection.service";
import { BadRequestException } from "../exceptions/bad-request.exception";

@injectable()
export class ConnectionController implements Controller {
    constructor(
        @inject(CONFIG.HonoProvider) private hono: HonoProvider,
        @inject(CONFIG.ConnectionService) private connectionService: ConnectionService,
    ) {}
    
    public registerMiddlewaresbeforeGlobal(): void {}
    
    public registerMiddlewaresAfterGlobal(): void {}
    
    public registerRoutes(): void {
        // search users
        this.hono.app.get("/api/users", async (c) => {
            const searchQuery = c.req.query("search") || "";
            const users = await this.connectionService.searchUsers(searchQuery);
        
            return c.json({
                success: true,
                message: "Users retrieved successfully",
                body: users,
            });
        });

        // get connections
        this.hono.app.get("/api/connections", async (c) => {
            const user = c.var.user;
            if (!user || user.id === undefined) {
                throw new BadRequestException("User not found or user ID is undefined");
            }
            const userId = BigInt(user.id);
            const connections = await this.connectionService.getConnections(userId);
            return c.json({
                success: true,
                message: "Connections retrieved successfully",
                body: connections,
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
            
            await this.connectionService.sendConnectionRequest(from_id, BigInt(to_id));
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
                throw new BadRequestException("Invalid action. Use 'accept' or 'reject'.");
            }
            
            await this.connectionService.respondToConnectionRequest(from_id, to_id, action);
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
            const requests = await this.connectionService.getConnectionRequests(userId);
            return c.json({
                success: true,
                message: "Connection requests retrieved successfully",
                body: requests,
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
    }
}

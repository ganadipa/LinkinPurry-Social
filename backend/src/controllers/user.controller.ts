import { inject, injectable } from "inversify";
import { Controller } from "./controller";
import { CONFIG } from "../ioc/config";
import { HonoProvider } from "../core/hono-provider";
import { UserService } from "../services/user.service";
import { BadRequestException } from "../exceptions/bad-request.exception";

@injectable()
export class UserController implements Controller {
    constructor(
        @inject(CONFIG.HonoProvider) private hono: HonoProvider,
        @inject(CONFIG.UserService) private userService: UserService
    ) {}

    public registerMiddlewaresbeforeGlobal(): void {}

    public registerMiddlewaresAfterGlobal(): void {}

    public registerRoutes(): void {
        // Get a user by ID
        this.hono.app.get("/api/users/:id", async (c) => {
            const id = c.req.param("id");
            if (!id) {
                throw new BadRequestException("User ID is required");
            }

            const user = await this.userService.getUserById(Number(id));
            if (!user) {
                return c.json(
                    { success: false, message: "User not found" },
                    404
                );
            }

            return c.json({
                success: true,
                message: "User retrieved successfully",
                body: {
                    id: Number(user.id),
                    full_name: user.full_name,
                    profile_photo_path: user.profile_photo_path,
                },
            });
        });
    }
}

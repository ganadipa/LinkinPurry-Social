import { User } from "../../../models/user.model";
import { IAuthStrategy } from "../../../interfaces/auth-strategy.interface";
import { inject, injectable } from "inversify";
import { CONFIG } from "../../../ioc/config";
import { UserRepository } from "../../../interfaces/user-repository.interface";

import { JwtService, TokenPayload } from "../jwt.service";

@injectable()
export class JwtAuthStrategy implements IAuthStrategy {
  constructor(
    @inject(CONFIG.UserRepository) private userRepository: UserRepository,
    @inject(CONFIG.JwtService) private jwtService: JwtService
  ) {}

  public async validate(token: string): Promise<User | null> {
    try {
      const payload = this.jwtService.verifyToken(token);
      if (!payload || !payload.userId) return null;

      const user = await this.userRepository.findById(Number(payload.userId));
      return user;
    } catch (error) {
      return null;
    }
  }

  public async getToken(userId: string, email: string): Promise<string> {
    return this.jwtService.generateToken(userId, email);
  }

  public getPayload(token: string): TokenPayload | null {
    return this.jwtService.verifyToken(token);
  }
}

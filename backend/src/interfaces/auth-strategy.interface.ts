import { TokenPayload } from "../services/auth/jwt.service";
import { User } from "../models/user.model";

export interface IAuthStrategy {
  validate(token: string): Promise<User | null>;
  getToken(userId: string, email: string): Promise<string>;
  getPayload(token: string): TokenPayload | null;
}

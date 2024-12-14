import { CookieOptions } from "hono/utils/cookie";
import { injectable } from "inversify";
import { JwtPayload, sign, verify } from "jsonwebtoken";

export interface TokenPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

@injectable()
export class JwtService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || "gana";
  public readonly TOKEN_EXPIRY_MS = 3600 * 1000;

  public generateToken(userId: string, email: string): string {
    const now = Math.floor(Date.now() / 1000);
    const payload: TokenPayload = {
      userId,
      email,
      iat: now,
      exp: now + this.TOKEN_EXPIRY_MS / 1000,
    };

    return sign(payload, this.JWT_SECRET);
  }

  public verifyToken(token: string): TokenPayload | null {
    try {
      return verify(token, this.JWT_SECRET) as TokenPayload;
    } catch (error) {
      return null;
    }
  }
}

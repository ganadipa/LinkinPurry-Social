import { HTTPException } from "hono/http-exception";

export class ForbiddenException extends HTTPException {
  constructor(message: string = "Forbidden Access") {
    super(403, { message });
  }
}

import { HTTPException } from "hono/http-exception";

export class BadRequestException extends HTTPException {
  constructor(message: string = "Bad Request") {
    super(400, { message });
  }
}

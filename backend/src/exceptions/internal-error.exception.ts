import { HTTPException } from "hono/http-exception";

export class InternalErrorException extends HTTPException {
  constructor(message: string = "Internal Server Error") {
    super(500, { message });
  }
}

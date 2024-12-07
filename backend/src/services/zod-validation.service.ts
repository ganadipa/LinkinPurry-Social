import { injectable } from "inversify";
import { BadRequestException } from "../exceptions/bad-request.exception";
import { z } from "zod";
import { InternalErrorException } from "../exceptions/internal-error.exception";

export type ValidationFunction = (value: any) => boolean;
export type ValidationSchema = Record<string, ValidationFunction>;
export type DataObject = Record<string, any>;

@injectable()
export class ZodValidationService {
  constructor() {}

  public validate(data: DataObject, schema: z.ZodObject<any>): boolean {
    try {
      schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors.map((e) => e.message).join(", ");
        throw new BadRequestException(message);
      }

      throw new InternalErrorException("Something terrible happened");
    }

    return true;
  }
}

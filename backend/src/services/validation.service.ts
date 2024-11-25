import { injectable } from "inversify";

export type ValidationFunction = (value: any) => boolean;
export type ValidationSchema = Record<string, ValidationFunction>;
export type DataObject = Record<string, any>;

@injectable()
export class ValidationService {
  constructor() {}

  public validate(data: DataObject, schema: ValidationSchema): boolean {
    Object.entries(schema).forEach(([field, validator]) => {
      validator(data[field]);
    });

    return true;
  }
}

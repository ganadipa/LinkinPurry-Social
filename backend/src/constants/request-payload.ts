import { BadRequestException } from "../exceptions/bad-request.exception";

export type LoginPayload = {
  identifier: string;
  password: string;
};

export const loginPayloadChecker = {
  identifier: (value: any) => {
    if (typeof value !== "string") {
      throw new BadRequestException("identifier must be a string");
    }

    if (value.length >= 50) {
      throw new BadRequestException(
        "identifier must be less than 50 characters"
      );
    }

    if (value.length == 0) {
      throw new BadRequestException("identifier must not be empty");
    }

    return true;
  },

  password: (value: any) => {
    if (typeof value !== "string") {
      throw new BadRequestException("Password must be a string");
    }

    if (value.length >= 50) {
      throw new BadRequestException("Password must be less than 50 characters");
    }

    if (value.length == 0) {
      throw new BadRequestException("Password must not be empty");
    }

    return true;
  },
};

export type RegisterPayload = {
  username: string;
  email: string;
  name: string;
  password: string;
};

export const registerPayloadChecker = {
  username: (value: any) => {
    if (typeof value !== "string") {
      throw new BadRequestException("Username must be a string");
    }

    if (value.length >= 50) {
      throw new BadRequestException("Username must be less than 50 characters");
    }

    if (value.length == 0) {
      throw new BadRequestException("Username must not be empty");
    }

    return true;
  },

  email: (value: any) => {
    if (typeof value !== "string") {
      throw new BadRequestException("Email must be a string");
    }

    if (value.length >= 50) {
      throw new BadRequestException("Email must be less than 50 characters");
    }

    if (value.length == 0) {
      throw new BadRequestException("Email must not be empty");
    }

    return true;
  },

  name: (value: any) => {
    if (typeof value !== "string") {
      throw new BadRequestException("Name must be a string");
    }

    if (value.length >= 50) {
      throw new BadRequestException("Name must be less than 50 characters");
    }

    if (value.length == 0) {
      throw new BadRequestException("Name must not be empty");
    }

    return true;
  },

  password: (value: any) => {
    if (typeof value !== "string") {
      throw new BadRequestException("Password must be a string");
    }

    if (value.length >= 50) {
      throw new BadRequestException("Password must be less than 20 characters");
    }

    if (value.length < 6) {
      throw new BadRequestException("Password must be at least 6 characters");
    }

    if (value.length == 0) {
      throw new BadRequestException("Password must not be empty");
    }

    return true;
  },
};

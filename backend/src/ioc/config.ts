export const CONFIG = {
  HonoProvider: Symbol.for("HonoProvider"),
  Server: Symbol.for("Server"),
  Router: Symbol.for("Router"),
  Controllers: Symbol.for("Controllers"),

  EmailService: Symbol.for("EmailService"),
  UserService: Symbol.for("UserService"),
  JwtService: Symbol.for("JwtService"),
  AuthService: Symbol.for("AuthService"),
  ValidationService: Symbol.for("ValidationService"),

  AuthStrategy: Symbol.for("Jwt"),
  JwtAuthStrategy: Symbol.for("Jwt"),

  UserRepository: Symbol.for("DbUserRepository"),
  DbUserRepository: Symbol.for("DbUserRepository"),

  PrismaProvider: Symbol.for("PrismaProvider"),

  AuthMiddleware: Symbol.for("AuthMiddleware"),
};

export const CONFIG = {
  HonoProvider: Symbol.for("HonoProvider"),
  OpenApiHonoProvider: Symbol.for("OpenApiHonoProvider"),
  SocketProvider: Symbol.for("SocketProvider"),
  Server: Symbol.for("Server"),
  Router: Symbol.for("Router"),
  Controllers: Symbol.for("Controllers"),

  EmailService: Symbol.for("EmailService"),
  UserService: Symbol.for("UserService"),
  JwtService: Symbol.for("JwtService"),
  AuthService: Symbol.for("AuthService"),
  ZodValidationService: Symbol.for("ZodValidationService"),
  ConnectionService: Symbol.for("ConnectionService"),
  ProfileService: Symbol.for("ProfileService"),
  FeedService: Symbol.for("FeedService"),
  ChatService: Symbol.for("ChatService"),
  NotificationService: Symbol.for("NotificationService"),
  FileService: Symbol.for("FileService"),

  AuthStrategy: Symbol.for("Jwt"),
  JwtAuthStrategy: Symbol.for("Jwt"),

  UserRepository: Symbol.for("DbUserRepository"),
  DbUserRepository: Symbol.for("DbUserRepository"),

  ConnectionRepository: Symbol.for("DbConnectionRepository"),
  DbConnectionRepository: Symbol.for("DbConnectionRepository"),

  FeedRepository: Symbol.for("DbFeedRepository"),
  DbFeedRepository: Symbol.for("DbFeedRepository"),

  ChatRepository: Symbol.for("DbChatRepository"),
  DbChatRepository: Symbol.for("DbChatRepository"),

  PushSubscriptionRepository: Symbol.for("DbPushSubscriptionRepository"),
  DbPushSubscriptionRepository: Symbol.for("DbPushSubscriptionRepository"),

  PrismaProvider: Symbol.for("PrismaProvider"),

  AuthMiddleware: Symbol.for("AuthMiddleware"),
  ResponseFormatterMiddleware: Symbol.for("ResponseFormatterMiddleware"),
};

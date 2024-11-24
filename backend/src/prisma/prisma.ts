import { PrismaClient } from "@prisma/client";
import { injectable } from "inversify";

@injectable()
export class PrismaService {
  private static instance: PrismaClient | null = null;
  private static client: PrismaClient;

  constructor() {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaClient({
        log: ["query", "info", "warn", "error"],
      });
    }
    PrismaService.client = PrismaService.instance;
  }

  get prisma(): PrismaClient {
    return PrismaService.client;
  }

  async disconnect() {
    await PrismaService.client.$disconnect();
  }
}

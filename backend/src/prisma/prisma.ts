import { PrismaClient } from "@prisma/client";
import { injectable } from "inversify";

@injectable()
export class PrismaProvider {
  private static instance: PrismaClient | null = null;
  private static client: PrismaClient;

  constructor() {
    if (!PrismaProvider.instance) {
      PrismaProvider.instance = new PrismaClient({
        log: ["warn", "error"],
      });
    }
    PrismaProvider.client = PrismaProvider.instance;
  }

  get prisma(): PrismaClient {
    return PrismaProvider.client;
  }

  async disconnect() {
    await PrismaProvider.client.$disconnect();
  }
}

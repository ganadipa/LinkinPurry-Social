import { inject, injectable } from "inversify";
import { PrismaProvider } from "../../prisma/prisma";
import { ConnectionRepository } from "../../interfaces/connection-repository.interface";
import { CONFIG } from "../../ioc/config";
import { Connection, ConnectionRequest } from "../../models/connection.model";

@injectable()
export class DbConnectionRepository implements ConnectionRepository {
  constructor(@inject(CONFIG.PrismaProvider) private prisma: PrismaProvider) {}

  async getConnectionsByUserId(userId: bigint): Promise<Connection[]> {
    return await this.prisma.prisma.connection.findMany({
      where: { from_id: userId },
      include: {
        users_connection_to_idTousers: false,
      },
    });
  }

  async createConnection(fromId: bigint, toId: bigint): Promise<void> {
    await this.prisma.prisma.connection.createMany({
      data: [
        { from_id: fromId, to_id: toId, created_at: new Date() },
        { from_id: toId, to_id: fromId, created_at: new Date() },
      ],
    });
  }

  async removeConnection(fromId: bigint, toId: bigint): Promise<void> {
    await this.prisma.prisma.connection.deleteMany({
      where: {
        OR: [
          { from_id: fromId, to_id: toId },
          { from_id: toId, to_id: fromId },
        ],
      },
    });
  }

  async getConnectionRequests(userId: bigint): Promise<ConnectionRequest[]> {
    return await this.prisma.prisma.connection_request.findMany({
      where: { to_id: userId },
      orderBy: { created_at: "desc" },
    });
  }

  async createConnectionRequest(fromId: bigint, toId: bigint): Promise<void> {
    const existingRequest =
      await this.prisma.prisma.connection_request.findUnique({
        where: {
          from_id_to_id: {
            from_id: fromId,
            to_id: toId,
          },
        },
      });

    if (existingRequest) {
      throw new Error("Connection request already exists.");
    }

    await this.prisma.prisma.connection_request.create({
      data: {
        from_id: fromId,
        to_id: toId,
        created_at: new Date(),
      },
    });
  }

  async removeConnectionRequest(fromId: bigint, toId: bigint): Promise<void> {
    await this.prisma.prisma.connection_request.delete({
      where: { from_id_to_id: { from_id: fromId, to_id: toId } },
    });
  }

  async countConnections(userId: bigint): Promise<number> {
    return await this.prisma.prisma.connection.count({
      where: { from_id: userId },
    });
  }

  async checkConnection(fromId: bigint, toId: bigint): Promise<boolean> {
    const connection = await this.prisma.prisma.connection.findFirst({
      where: {
        from_id: fromId,
        to_id: toId,
      },
    });
    return !!connection;
  }

  async getConnectionRequestsFrom(userId: bigint): Promise<ConnectionRequest[]> {
    return await this.prisma.prisma.connection_request.findMany({
      where: { from_id: userId },
      orderBy: { created_at: "desc" },
    });
  }
}

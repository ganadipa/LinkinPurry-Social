import { inject, injectable } from "inversify";
import { PrismaProvider } from "../../prisma/prisma";
import { ConnectionRepository } from "../../interfaces/connection-repository.interface";
import { CONFIG } from "../../ioc/config";
import { Connection, ConnectionRequest } from "../../models/connection.model";
import { User } from "../../models/user.model";
import { InternalErrorException } from "../../exceptions/internal-error.exception";

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

  async getConnectionRequestsFrom(
    userId: bigint
  ): Promise<ConnectionRequest[]> {
    return await this.prisma.prisma.connection_request.findMany({
      where: { from_id: userId },
      orderBy: { created_at: "desc" },
    });
  }

  async getFriendsId(userId: bigint): Promise<bigint[]> {
    const connections = await this.prisma.prisma.connection.findMany({
      where: { from_id: userId },
    });

    return connections.map((connection) => connection.to_id);
  }

  async getConnectionRecommendations(userId: bigint): Promise<User[]> {
    // Get direct connections first
    const directConnections = await this.prisma.prisma.connection.findMany({
      where: {
        OR: [{ from_id: userId }, { to_id: userId }],
      },
    });

    // Get IDs of direct connections
    const connectedIds = new Set(
      directConnections
        .flatMap((conn) => [conn.from_id, conn.to_id])
        .filter((id) => id !== userId)
    );

    // Find recommendations (2nd and 3rd degree)
    const ret = await this.prisma.prisma.users.findMany({
      where: {
        AND: [
          { id: { not: userId } }, // Exclude self
          { id: { notIn: Array.from(connectedIds) } }, // Exclude direct connections
          {
            OR: [
              // 2nd degree connections
              {
                connection_connection_to_idTousers: {
                  some: {
                    from_id: {
                      in: Array.from(connectedIds),
                    },
                  },
                },
              },
              {
                connection_connection_from_idTousers: {
                  some: {
                    to_id: {
                      in: Array.from(connectedIds),
                    },
                  },
                },
              },
              // 3rd degree connections
              {
                connection_connection_to_idTousers: {
                  some: {
                    from_id: {
                      in: Array.from(connectedIds),
                    },
                  },
                },
              },
              {
                connection_connection_from_idTousers: {
                  some: {
                    to_id: {
                      in: Array.from(connectedIds),
                    },
                  },
                },
              },
            ],
          },
        ],
      },
      take: 10,
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        username: true,
        full_name: true,
        profile_photo_path: true,
        work_history: true,
        skills: true,
        email: true,
        password_hash: true,
        created_at: true,
        updated_at: true,
      },
    });

    return ret.map((user) => {
      if (!user.full_name) {
        throw new InternalErrorException("User full name is missing");
      }

      return new User(
        user.username,
        user.email,
        user.password_hash,
        user.full_name,
        user.profile_photo_path,
        user.id,
        user.created_at,
        user.updated_at
      );
    });
  }
}

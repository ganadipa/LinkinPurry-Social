import { inject, injectable } from "inversify";
import { CONFIG } from "../../ioc/config";
import { ConnectionRequest } from "../../models/connection-request.model";
import { PrismaProvider } from "../../prisma/prisma";
import { ConnectionRequestRepository } from "../../interfaces/connection-request-repository.interface";

@injectable()
export class DbConnectionRequestRepository
  implements ConnectionRequestRepository
{
  constructor(@inject(CONFIG.PrismaProvider) private prisma: PrismaProvider) {}

  public async create(request: ConnectionRequest): Promise<ConnectionRequest> {
    const newRequest = await this.prisma.prisma.connection_request.create({
      data: {
        from_id: request.from_id,
        to_id: request.to_id,
        created_at: new Date(),
      },
    });

    return newRequest;
  }

  public async delete(fromId: number, toId: number): Promise<void> {
    await this.prisma.prisma.connection_request.delete({
      where: {
        from_id_to_id: {
          from_id: fromId,
          to_id: toId,
        },
      },
    });
  }

  public async findPendingRequestsByUserId(
    userId: number
  ): Promise<ConnectionRequest[]> {
    const requests = await this.prisma.prisma.connection_request.findMany({
      where: {
        to_id: userId,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return requests;
  }

  public async findSentRequestsByUserId(
    userId: number
  ): Promise<ConnectionRequest[]> {
    const requests = await this.prisma.prisma.connection_request.findMany({
      where: {
        from_id: userId,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return requests;
  }

  public async exists(fromId: number, toId: number): Promise<boolean> {
    const request = await this.prisma.prisma.connection_request.findUnique({
      where: {
        from_id_to_id: {
          from_id: fromId,
          to_id: toId,
        },
      },
    });

    return request !== null;
  }

  public async countPendingRequests(userId: number): Promise<number> {
    const count = await this.prisma.prisma.connection_request.count({
      where: {
        to_id: userId,
      },
    });

    return count;
  }
}

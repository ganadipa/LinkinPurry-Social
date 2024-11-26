import { inject, injectable } from "inversify";
import { PrismaProvider } from "../../prisma/prisma";
import { ConnectionRepository } from "../../interfaces/connection-repository.interface";
import { CONFIG } from "../../ioc/config";

@injectable()
export class DbConnectionRepository implements ConnectionRepository {
    constructor(@inject(CONFIG.PrismaProvider) private prisma: PrismaProvider) {}
    
    async getConnectionsByUserId(userId: bigint): Promise<any[]> {
        return await this.prisma.prisma.connection.findMany({
            where: { from_id: userId },
            include: {
                users_connection_to_idTousers: true,
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
    
    async getConnectionRequests(userId: bigint): Promise<any[]> {
        return await this.prisma.prisma.connection_request.findMany({
            where: { to_id: userId },
            orderBy: { created_at: "desc" },
        });
    }
    
    async createConnectionRequest(fromId: bigint, toId: bigint): Promise<void> {
        await this.prisma.prisma.connection_request.create({
            data: { from_id: fromId, to_id: toId, created_at: new Date() },
        });
    }
    
    async removeConnectionRequest(fromId: bigint, toId: bigint): Promise<void> {
        await this.prisma.prisma.connection_request.delete({
            where: { from_id_to_id: { from_id: fromId, to_id: toId } },
        });
    }
}

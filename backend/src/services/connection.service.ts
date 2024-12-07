import { inject, injectable } from "inversify";
import { ConnectionRepository } from "../interfaces/connection-repository.interface";
import { UserRepository } from "../interfaces/user-repository.interface";
import { CONFIG } from "../ioc/config";

@injectable()
export class ConnectionService {
  constructor(
    @inject(CONFIG.ConnectionRepository)
    private connectionRepository: ConnectionRepository,
    @inject(CONFIG.UserRepository)
    private userRepository: UserRepository
  ) {}

  async searchUsers(keyword: string) {
    return await this.userRepository.searchUsers(keyword);
  }

  async getConnections(userId: bigint) {
    return await this.connectionRepository.getConnectionsByUserId(userId);
  }

  async getAllConnectedUserIds(userId: bigint): Promise<bigint[]> {
    const connections = await this.connectionRepository.getConnectionsByUserId(userId);
  
    const connectedUserIds = connections.map((connection) =>
      connection.from_id === userId ? connection.to_id : connection.from_id
    );
  
    return connectedUserIds;
  }
  
  async sendConnectionRequest(fromId: bigint, toId: bigint) {
    return await this.connectionRepository.createConnectionRequest(
      fromId,
      toId
    );
  }

  async respondToConnectionRequest(
    fromId: bigint,
    toId: bigint,
    action: "accept" | "reject"
  ) {
    if (action === "accept") {
      await this.connectionRepository.createConnection(fromId, toId);
    }
    await this.connectionRepository.removeConnectionRequest(fromId, toId);
  }

  async getConnectionRequests(userId: bigint) {
    return await this.connectionRepository.getConnectionRequests(userId);
  }

  async unconnect(fromId: bigint, toId: bigint) {
    return await this.connectionRepository.removeConnection(fromId, toId);
  }

  async checkConnection(fromId: bigint, toId: bigint) {
    return await this.connectionRepository.checkConnection(fromId, toId);
  }

    async getConnectionRequestsFrom(userId: bigint) {
        return await this.connectionRepository.getConnectionRequestsFrom(userId);
    }
}

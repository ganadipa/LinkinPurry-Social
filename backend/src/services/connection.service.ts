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
    const connections = await this.connectionRepository.getConnectionsByUserId(
      userId
    );

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

  async getConnectionRecommendations(userId: bigint) {
    return await this.connectionRepository.getConnectionRecommendations(userId);
  }

  async checkConnection(fromId: bigint, toId: bigint) {
    return await this.connectionRepository.checkConnection(fromId, toId);
  }

  async getConnectionRequestsFrom(userId: bigint) {
    return await this.connectionRepository.getConnectionRequestsFrom(userId);
  }

  async getConnectionStatuses(
    currentUserId: bigint,
    userIds: number[]
  ): Promise<
    { userId: number; status: "connected" | "pending" | "not_connected" }[]
  > {
    const connections = await this.connectionRepository.getConnectionsByUserId(
      currentUserId
    );
    const connectionRequests =
      await this.connectionRepository.getConnectionRequests(currentUserId);
    const connectionRequestsFrom =
      await this.connectionRepository.getConnectionRequestsFrom(currentUserId);

    const statuses = userIds.map((userId) => {
      const isConnected = connections.some(
        (conn) =>
          (conn.from_id === currentUserId && conn.to_id === BigInt(userId)) ||
          (conn.to_id === currentUserId && conn.from_id === BigInt(userId))
      );

      const isPending = connectionRequests.some(
        (req) => req.from_id === BigInt(userId)
      );

      const isPendingFrom = connectionRequestsFrom.some(
        (req) => req.to_id === BigInt(userId)
      );

      if (isConnected) return { userId, status: "connected" as "connected" };
      if (isPending || isPendingFrom)
        return { userId, status: "pending" as "pending" };
      return { userId, status: "not_connected" as "not_connected" };
    });

    return statuses;
  }

  async getConnectionStatus(
    currentUserId: bigint,
    targetUserId: bigint
  ): Promise<"connected" | "pending" | "not_connected"> {
    const connections = await this.connectionRepository.getConnectionsByUserId(
      currentUserId
    );
    const connectionRequests =
      await this.connectionRepository.getConnectionRequests(currentUserId);
    const connectionRequestsFrom =
      await this.connectionRepository.getConnectionRequestsFrom(currentUserId);

    const isConnected = connections.some(
      (conn) =>
        (conn.from_id === currentUserId && conn.to_id === targetUserId) ||
        (conn.to_id === currentUserId && conn.from_id === targetUserId)
    );

    const isPending = connectionRequests.some(
      (req) => req.from_id === targetUserId
    );

    const isPendingFrom = connectionRequestsFrom.some(
      (req) => req.to_id === targetUserId
    );

    if (isConnected) return "connected";
    if (isPending || isPendingFrom) return "pending";
    return "not_connected";
  }
}

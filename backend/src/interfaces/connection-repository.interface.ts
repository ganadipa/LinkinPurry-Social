import { User } from "../models/user.model";
import { Connection, ConnectionRequest } from "../models/connection.model";

export interface ConnectionRepository {
  getConnectionsByUserId(userId: bigint): Promise<Connection[]>;
  createConnection(fromId: bigint, toId: bigint): Promise<void>;
  removeConnection(fromId: bigint, toId: bigint): Promise<void>;
  getConnectionRequests(userId: bigint): Promise<ConnectionRequest[]>;
  createConnectionRequest(fromId: bigint, toId: bigint): Promise<void>;
  removeConnectionRequest(fromId: bigint, toId: bigint): Promise<void>;
  countConnections(userId: bigint): Promise<number>;
  checkConnection(fromId: bigint, toId: bigint): Promise<boolean>;
  getConnectionRequestsFrom(userId: bigint): Promise<ConnectionRequest[]>;
  getFriendsId(userId: bigint): Promise<bigint[]>;
  getConnectionRecommendations(userId: bigint): Promise<User[]>;
}

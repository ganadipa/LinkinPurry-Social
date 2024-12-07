import { ConnectionRequest } from "../models/connection-request.model";

export interface ConnectionRequestRepository {
  create(request: ConnectionRequest): Promise<ConnectionRequest>;
  delete(fromId: number, toId: number): Promise<void>;
  findPendingRequestsByUserId(userId: number): Promise<ConnectionRequest[]>;
  findSentRequestsByUserId(userId: number): Promise<ConnectionRequest[]>;
  exists(fromId: number, toId: number): Promise<boolean>;
  countPendingRequests(userId: number): Promise<number>;
}

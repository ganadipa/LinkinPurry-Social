export interface ConnectionRepository {
    getConnectionsByUserId(userId: bigint): Promise<any[]>;
    createConnection(fromId: bigint, toId: bigint): Promise<void>;
    removeConnection(fromId: bigint, toId: bigint): Promise<void>;
    getConnectionRequests(userId: bigint): Promise<any[]>;
    createConnectionRequest(fromId: bigint, toId: bigint): Promise<void>;
    removeConnectionRequest(fromId: bigint, toId: bigint): Promise<void>;
}

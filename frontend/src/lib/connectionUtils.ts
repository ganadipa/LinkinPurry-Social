export function determineStatus(
    userId: number,
    currentUserId: number,
    connections: { from_id: number; to_id: number }[],
    connectionRequests: { from_id: number; to_id: number }[],
    connectionRequestsFrom: { from_id: number; to_id: number }[]
): "connected" | "pending" | "not_connected" {
    const isConnected = connections.some(
        (conn) =>
            (conn.from_id === currentUserId && conn.to_id === userId) ||
        (conn.to_id === currentUserId && conn.from_id === userId)
    );
    
    const isPending = connectionRequests.some(
        (req) =>
            (req.to_id === currentUserId && req.from_id === userId)
    );

    const isPendingFrom = connectionRequestsFrom.some(
        (req) => req.to_id === userId && req.from_id === currentUserId
    );

    if (isConnected) return "connected";
    if (isPending || isPendingFrom) return "pending";
    return "not_connected";
}

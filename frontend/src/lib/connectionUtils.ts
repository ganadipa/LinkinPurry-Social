import { connections, connectionRequests } from "@/lib/dummyConnections";

export function determineStatus(userId: string, currentUserId: string): "connected" | "pending" | "not_connected" {
  if (
    connections.some(
      (conn) =>
        (conn.from_id === currentUserId && conn.to_id === userId) ||
        (conn.to_id === currentUserId && conn.from_id === userId)
    )
  ) {
    return "connected";
  }

  if (
    connectionRequests.some(
      (req) => 
        (req.request_to_id === currentUserId && req.request_from_id === userId) ||
        (req.request_to_id === userId && req.request_from_id === currentUserId)
    )
  ) {
    return "pending";
  }

  return "not_connected";
}

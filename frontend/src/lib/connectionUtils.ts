export async function determineStatus(
    userId: number,
    currentUserId: number
): Promise<"connected" | "pending" | "not_connected"> {
    try {
        const connectionsResponse = await fetch(`/api/connections`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const requestsResponse = await fetch(`/api/connections/requests`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        
        if (!connectionsResponse.ok || !requestsResponse.ok) {
            throw new Error("Failed to fetch connection data");
        }
        
        const connectionsData = await connectionsResponse.json();
        alert("connectionsData: " + connectionsData); // debug
        const requestsData = await requestsResponse.json();
        
        const connections = connectionsData.body || [];
        const connectionRequests = requestsData.body || [];
        
        const isConnected = connections.some(
            (conn: { from_id: number; to_id: number }) =>
                (conn.from_id === currentUserId && conn.to_id === userId) ||
                (conn.to_id === currentUserId && conn.from_id === userId)
        );
        
        const isPending = connectionRequests.some(
            (req: { request_to_id: number; request_from_id: number }) =>
                (req.request_to_id === currentUserId && req.request_from_id === userId) ||
                (req.request_to_id === userId && req.request_from_id === currentUserId)
        );
        
        if (isConnected) return "connected";
        if (isPending) return "pending";
        return "not_connected";
    } catch (error) {
        console.error("Error determining status:", error);
        return "not_connected";
    }
}

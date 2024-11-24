import { useState } from "react";
import { UserCard } from "@/components/ui/user-card";
import { users, connectionRequests, connections } from "@/lib/dummyConnections";

export default function ConnectionRequestsPage() {
  const [requests, setRequests] = useState(
    connectionRequests.filter((req) => req.request_to_id === "1") // User1 yang lagi login
  );

  const handleResponse = (requestId: string, accept: boolean) => {
    const requestIndex = connectionRequests.findIndex(
      (req) => req.request_from_id === requestId && req.request_to_id === "1"
    );

    if (accept) {
      const acceptedRequest = connectionRequests[requestIndex];
      connections.push({
        from_id: acceptedRequest.request_from_id,
        to_id: acceptedRequest.request_to_id,
        created_at: new Date().toISOString(),
      });
      connections.push({
        from_id: acceptedRequest.request_to_id,
        to_id: acceptedRequest.request_from_id,
        created_at: new Date().toISOString(),
      });
    }

    connectionRequests.splice(requestIndex, 1);
    setRequests(connectionRequests.filter((req) => req.request_to_id === "1"));
    alert(accept ? "Request accepted." : "Request declined.");
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 space-y-4">
      {requests.map((req) => {
        const user = users.find((user) => user.id === req.request_from_id);
        return (
          <UserCard
            key={req.request_from_id}
            name={user?.name || ""}
            description={user?.description || ""}
            profilePhoto={user?.profilePhoto || ""}
            status="pending"
            onAccept={() => handleResponse(user!.id, true)}
            onDecline={() => handleResponse(user!.id, false)}
          />
        );
      })}
    </div>
  );
}

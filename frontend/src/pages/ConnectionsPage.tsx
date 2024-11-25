import { useState } from "react";
import { UserCard } from "@/components/ui/user-card";
import { currentUser, users, connections } from "@/lib/dummyConnections";

export default function ConnectionsPage() {
  const [connectionsList] = useState(
    connections
      .filter((conn) => conn.from_id === currentUser.id)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((conn) => {
        const userId = conn.from_id === currentUser.id ? conn.to_id : conn.from_id;
        return users.find((user) => user.id === userId)!;
      })
  );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 space-y-4">
      {connectionsList.map((connection) => (
        <UserCard
          key={connection.id}
          name={connection.name}
          profilePhoto={connection.profilePhoto}
          status="connected"
          hideStatus={true}
        />
      ))}
    </div>
  );
}

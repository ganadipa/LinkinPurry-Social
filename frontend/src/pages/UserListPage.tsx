import { useState } from "react";
import { UserCard } from "@/components/ui/user-card";
import { users, connections, connectionRequests } from "@/lib/dummyConnections";

export default function UserListPage() {
    const [search, setSearch] = useState("");

    const handleConnect = (userId: string) => {
        connectionRequests.push({
            request_from_id: "1", // User1 yang lagi login
            request_to_id: userId,
            created_at: new Date().toISOString(),
        });
        console.log("Connection request sent to user", userId);
        alert("Connection request sent to user " + userId);
    };

    const filteredUsers = users.filter(
        (user) =>
            user.id !== "1" && // selain yang lagi login 
            user.name.toLowerCase().includes(search.toLowerCase())
    );

    const determineStatus = (userId: string): "connected" | "pending" | "not_connected" => {
        if (
            connections.some(
                (connection) =>
                    (connection.from_id === "1" && connection.to_id === userId) &&
                    (connection.from_id === userId && connection.to_id === "1")
            )
        ) {
            return "connected";
        }

        if (
            connectionRequests.some(
                (request) => 
                    (request.request_from_id === "1" && request.request_to_id === userId) ||
                    (request.request_from_id === userId && request.request_to_id === "1")
            )
        ) {
            return "pending";
        }

        return "not_connected";
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6">
            <input
                type="text"
                placeholder="Search Users"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 mb-6 w-full"
            />
            <div className="space-y-4">
                {filteredUsers.map((user) => (
                    <UserCard
                        key={user.id}
                        name={user.name}
                        description={user.description}
                        profilePhoto={user.profilePhoto}
                        status={determineStatus(user.id)}
                        onConnect={() => handleConnect(user.id)}
                    />
                ))}
            </div>
        </div>
    )
}
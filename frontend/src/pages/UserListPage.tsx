import { useState } from "react";
import { UserCard } from "@/components/ui/user-card";
import { currentUser, users, connectionRequests } from "@/lib/dummyConnections";
import { determineStatus } from "@/lib/connectionUtils";

export default function UserListPage() {
    const [search, setSearch] = useState("");

    const handleConnect = (userId: string) => {
        connectionRequests.push({
            request_from_id: currentUser.id,
            request_to_id: userId,
            created_at: new Date().toISOString(),
        });
        console.log("Connection request sent to user", userId);
        alert("Connection request sent to user " + userId);
    };

    const filteredUsers = users.filter(
        (user) =>
            user.id !== currentUser.id &&
            user.name.toLowerCase().includes(search.toLowerCase())
    );

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
                        status={determineStatus(user.id, currentUser.id)}
                        onConnect={() => handleConnect(user.id)}
                        hideStatus={!currentUser.loggedIn}
                    />
                ))}
            </div>
        </div>
    )
}
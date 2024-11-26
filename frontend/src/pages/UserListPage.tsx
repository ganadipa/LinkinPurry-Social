import { useState, useEffect } from "react";
import { UserCard } from "@/components/ui/user-card";
import { useAuth } from "@/hooks/auth";
import { determineStatus } from "@/lib/connectionUtils";
import { getUsersResponse } from "@/types/response";

export default function UserListPage() {
    const { user: currentUser } = useAuth();
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState<{ id: number; full_name: string; profile_photo_path: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [statuses, setStatuses] = useState<{ [key: number]: "connected" | "pending" | "not_connected" }>({});

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `/api/users${search ? `?search=${search}` : ""}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }

                const data = await response.json();
                const parsed = getUsersResponse.safeParse(data);

                if (!parsed.success) {
                    console.error("Invalid response structure:", parsed.error);
                    throw new Error("Invalid response structure");
                }

                const validatedUsers = parsed.data.body;
                setUsers(validatedUsers);

                // update status
                const statusMap: { [key: number]: "connected" | "pending" | "not_connected" } = {};
                const statusPromises = validatedUsers.map(async (user) => {
                    if (!currentUser) {
                        statusMap[user.id] = "not_connected";
                    } else {
                        statusMap[user.id] = await determineStatus(user.id, currentUser.id || 0);
                        alert("statusMap user.id" + user.id + statusMap[user.id]); // debug
                    }
                });

                await Promise.all(statusPromises);

                setStatuses(statusMap);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [search, currentUser]);

    const handleConnect = async (userId: number) => {
        try {
            const response = await fetch("/api/connections/request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ to_id: userId }),
            });

            const data = await response.json();
            if (!response.ok) {
                alert(`Failed to send connection request: ${data.message}`);
                return;
            }

            alert("Connection request sent successfully!");
            setStatuses((prev) => ({ ...prev, [userId]: "pending" }));
        } catch (error) {
            console.error("Error sending connection request:", error);
            alert("Failed to send connection request.");
        }
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
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="space-y-4">
                    {users
                        .filter((user) => user.id !== currentUser?.id)
                        .map((user) => (
                            <UserCard
                                key={user.id}
                                name={user.full_name}
                                profilePhoto={user.profile_photo_path}
                                status={statuses[user.id]}
                                onConnect={() => handleConnect(user.id)}
                                hideStatus={!currentUser}
                            />
                        ))}
                </div>
            )}
        </div>
    );
}

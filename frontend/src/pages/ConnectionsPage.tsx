import { useState, useEffect } from "react";
import { UserCard } from "@/components/ui/user-card";
import { useAuth } from "@/hooks/auth";

interface ConnectionsPageProps {
    id?: number;
}

export default function ConnectionsPage({ id }: ConnectionsPageProps) {
    const { user: currentUser } = useAuth();
    const [connectionsList, setConnectionsList] = useState<
        { id: number; full_name: string; profile_photo_path: string }[]
    >([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchConnections = async () => {
            if (!id && !currentUser) return;

            setLoading(true);
            try {
                const response = await fetch(`/api/connections${id ? `?user_id=${id}` : ""}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch connections");
                }

                const data = await response.json();
                const parsedConnections = data.body.map((connection: any) => {
                    const userId =
                        connection.from_id === (id || currentUser?.id)
                            ? connection.to_id
                            : connection.from_id;
                    return {
                        id: userId,
                        full_name: connection.full_name,
                        profile_photo_path: connection.profile_photo_path,
                    };
                });

                setConnectionsList(parsedConnections);
            } catch (error) {
                console.error("Error fetching connections:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchConnections();
    }, [id, currentUser]);

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 space-y-4">
            {loading ? (
                <p>Loading...</p>
            ) : connectionsList.length === 0 ? (
                <p>No connections found.</p>
            ) : (
                connectionsList.map((connection) => (
                    <UserCard
                        key={connection.id}
                        name={connection.full_name}
                        profilePhoto={connection.profile_photo_path}
                        status="connected"
                        hideStatus={true}
                    />
                ))
            )}
        </div>
    );
}

import { useState, useEffect } from "react";
import { UserCard } from "@/components/ui/user-card";
import { useAuth } from "@/hooks/auth";

export default function ConnectionRequestsPage() {
    const { user: currentUser } = useAuth();
    const [requests, setRequests] = useState<{ id: number; full_name: string; profile_photo_path: string; from_id: number }[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api/connections/requests", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch connection requests");
                }

                const data = await response.json();
                const parsedRequests = data.body.map((request: any) => ({
                    ...request,
                    from_id: Number(request.from_id),
                    to_id: Number(request.to_id),
                }));

                setRequests(parsedRequests);
            } catch (error) {
                console.error("Error fetching connection requests:", error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchRequests();
        }
    }, [currentUser]);

    const handleResponse = async (fromId: number, accept: boolean) => {
        try {
            const response = await fetch(`/api/connections/requests/${fromId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ action: accept ? "accept" : "reject" }),
            });

            const data = await response.json();
            if (!response.ok) {
                alert(`Failed to ${accept ? "accept" : "decline"} the request: ${data.message}`);
                return;
            }

            alert(accept ? "Request accepted." : "Request declined.");
            setRequests((prev) => prev.filter((req) => req.from_id !== fromId));
        } catch (error) {
            console.error(`Error ${accept ? "accepting" : "declining"} the request:`, error);
            alert("Failed to process the request.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 space-y-4">
            {loading ? (
                <p>Loading...</p>
            ) : requests.length === 0 ? (
                <p>No connection requests found.</p>
            ) : (
                requests.map((req) => (
                    <UserCard
                        key={req.from_id}
                        name={req.full_name}
                        profilePhoto={req.profile_photo_path}
                        status="pending"
                        onAccept={() => handleResponse(req.from_id, true)}
                        onDecline={() => handleResponse(req.from_id, false)}
                    />
                ))
            )}
        </div>
    );
}

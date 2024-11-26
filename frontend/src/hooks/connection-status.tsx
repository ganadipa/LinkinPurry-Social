import { useEffect, useState } from "react";

export function useConnectionStatus(
  userId: number | null,
  otherUserId: number | null
) {
  const [status, setStatus] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId && otherUserId) fetchConnectionStatus();
    else {
      setStatus(null);
      setLoading(false);
    }
  }, [userId, otherUserId]);

  const fetchConnectionStatus = async () => {
    setLoading(true);
    const response = await fetch(`/api/connection/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from_id: userId,
        to_id: otherUserId,
      }),
    });
    if (!response.ok) {
      setLoading(false);
      return;
    }

    const json = await response.json();
    setStatus(json.body.connected);
    setLoading(false);
  };

  const toggleConnection = async () => {
    if (status === null) return;
  
    setLoading(true);
  
    // Tentukan apakah akan menggunakan POST atau DELETE
    const method = status ? "DELETE" : "POST";
  
    // Tentukan URL dan body berdasarkan metode
    const url = status 
      ? `/api/connections/${otherUserId}` 
      : `/api/connections/request`;
  
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      ...(method === "POST" && {
        body: JSON.stringify({ to_id: otherUserId }),
      }),
    };
  
    try {
      const response = await fetch(url, options);
  
      if (response.ok) {
        setStatus(!status);
      } else {
        const data = await response.json();
        console.log(`Failed to update connection: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating connection:", error);
      console.log("Failed to update connection.");
    } finally {
      setLoading(false);
    }
  };  

  return {
    status,
    loading,
    toggleConnection,
  };
}

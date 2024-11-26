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

  return {
    status,
    loading,
  };
}

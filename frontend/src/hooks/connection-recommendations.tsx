import { ErrorSchema } from "@/schemas/error.schema";
import { GetUsersResponseSuccessSchema } from "@/schemas/user.schema";
import { User } from "@/types/user";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function useConnectionRecommendation() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConnectionRecommendations();
  }, []);

  const fetchConnectionRecommendations = async () => {
    let ok = true;
    try {
      const response = await fetch(`/api/connections/recommendations`);
      if (!response.ok) {
        return;
      }

      const json = await response.json();
      const error = ErrorSchema.safeParse(json);
      if (error.success) {
        throw new Error(error.data.message);
      }

      const expected = GetUsersResponseSuccessSchema.safeParse(json);
      if (!expected.success || !expected.data.success) {
        throw new Error("Failed to fetch recommendations");
      }

      setUsers(expected.data.body);
    } catch (err) {
      ok = false;
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }

    return ok;
  };

  return { users, loading };
}

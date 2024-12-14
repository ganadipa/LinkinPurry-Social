import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { UserCard } from "@/components/ui/user-card";
import { useAuth } from "@/hooks/auth";
import { getUsersResponse } from "@/types/response";
import Loading from "@/components/loading";
import { useTitle } from "@/hooks/title";
import toast from "react-hot-toast";

export default function UserListPage() {
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<
    { id: number; full_name: string; profile_photo_path: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState<{
    [key: number]: "connected" | "pending" | "not_connected";
  }>({});

  const fetchUsersDebounced = useCallback(
    debounce(async (searchQuery: string) => {
      setLoading(true);
      toast.loading("Loading users...");
      try {
        const response = await fetch(
          `/api/users${searchQuery ? `?search=${searchQuery}` : ""}`,
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

        if (currentUser) {
          // Fetch statuses in bulk
          const statusResponse = await fetch("/api/connections/statuses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userIds: validatedUsers.map((u) => u.id) }),
          });

          if (!statusResponse.ok) {
            throw new Error("Failed to fetch connection statuses");
          }

          const statusData = await statusResponse.json();
          const statusMap = statusData.body.reduce(
            (acc: Record<number, "connected" | "pending" | "not_connected"> , { userId, status }: {
                userId: number;
                status: "connected" | "pending" | "not_connected";
              }) => {
              acc[userId] = status;
              return acc;
            },
            {}
          );

          setStatuses(statusMap);
        } else {
          setStatuses(
            validatedUsers.reduce((acc, user) => {
              acc[user.id] = "not_connected";
              return acc;
            }, {} as { [key: number]: "connected" | "pending" | "not_connected" })
          );
        }
        toast.dismiss();
        toast.success("Users loaded successfully.");
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.dismiss();
        toast.error("Failed to load users.");
      } finally {
        setLoading(false);
      }
    }, 600), // 600ms debounce delay
    [currentUser]
  );

  useTitle("People at LinkinPurry");

  useEffect(() => {
    fetchUsersDebounced(search);
  }, [search, fetchUsersDebounced]);

  if (loading) {
    return <Loading />;
  }

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
        toast.error(`Failed to send connection request: ${data.message}`);
        return;
      }

      toast.success("Connection request sent.");
      // update status locally
      setStatuses((prev) => ({ ...prev, [userId]: "pending" }));
    } catch (error) {
      console.error("Error sending connection request:", error);
      toast.error("Failed to send connection request.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <input
        type="text"
        placeholder="Search Users"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 rounded-lg p-2 mb-6 w-full"
      />
      {loading ? (
        <Loading />
      ) : (
        <div className="bg-white rounded-lg border border-gray-300">
          <h1 className="text-2xl font-semibold p-4">People</h1>
          {users
            .filter((user) => user.id !== currentUser?.id)
            .map((user) => (
              <UserCard
                key={user.id}
                id={user.id}
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

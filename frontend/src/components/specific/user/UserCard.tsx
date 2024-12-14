import { Link } from "@tanstack/react-router";

type ConnectionStatusType = "connected" | "pending" | "not_connected";

interface UserCardProps {
  id: number;
  name: string;
  profilePhoto: string;
  location?: string;
  headline?: string;
  status: ConnectionStatusType;
  onConnect?: () => void;
  hideStatus?: boolean;
}

export const UserCard = ({
  id,
  name,
  profilePhoto,
  status,
  onConnect,
  hideStatus = false,
}: UserCardProps) => {
  const getStatusButton = () => {
    if (hideStatus) return null;

    switch (status) {
      case "connected":
        return (
          <div className="px-3 py-1 text-sm border rounded-full border-gray-300 text-gray-500">
            Connected
          </div>
        );
      case "pending":
        return (
          <div className="px-3 py-1 text-sm border rounded-full border-gray-300 text-gray-500">
            Pending
          </div>
        );
      case "not_connected":
        return (
          <button
            onClick={onConnect}
            className="px-3 py-1 text-sm font-semibold text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50"
          >
            Connect
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <hr />
      <div className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <Link href={`/profile/${id}`}>
              <img
                src={profilePhoto || "/api/placeholder/64/64"}
                alt={`${name}'s profile`}
                className="w-16 h-16 rounded-full border border-gray-200"
              />
            </Link>
          </div>
          <div className="flex-1 min-w-0">
            <Link
              href={`/profile/${id}`}
              className="text-lg font-semibold text-gray-800 hover:underline"
            >
              {name}
            </Link>
          </div>
          <div className="flex-shrink-0">{getStatusButton()}</div>
        </div>
      </div>
    </>
  );
};

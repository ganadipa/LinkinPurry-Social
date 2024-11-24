import { Button } from "@/components/ui/button";

interface UserCardProps {
  name: string;
  description: string;
  profilePhoto: string;
  status: "connected" | "pending" | "not_connected";
  onConnect?: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
}

export function UserCard({
  name,
  description,
  profilePhoto,
  status,
  onConnect,
  onAccept,
  onDecline,
}: UserCardProps) {
  return (
    <div className="flex items-center bg-white rounded-lg shadow p-4">
      <img
        src={profilePhoto}
        alt={`${name}'s profile`}
        className="w-16 h-16 rounded-full mr-4"
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div>
        {status === "connected" && (
          <span className="text-green-500 font-semibold">Connected</span>
        )}
        {status === "pending" && (
          <div className="flex space-x-2">
            <Button onClick={onAccept} className="bg-green-500 text-white">
              Accept
            </Button>
            <Button onClick={onDecline} className="bg-red-500 text-white">
              Decline
            </Button>
          </div>
        )}
        {status === "not_connected" && (
          <Button onClick={onConnect} className="bg-blue-500 text-white">
            Connect
          </Button>
        )}
      </div>
    </div>
  );
}

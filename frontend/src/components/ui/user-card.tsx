import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

interface UserCardProps {
  id: number;
  name: string;
  profilePhoto: string;
  status: "connected" | "pending" | "not_connected";
  onConnect?: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
  hideStatus?: boolean;
}

export function UserCard({
  id,
  name,
  profilePhoto,
  status,
  onConnect,
  onAccept,
  onDecline,
  hideStatus = false,
}: UserCardProps) {
  return (
    <>
      <hr />
      <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg">
        <Link
          href={`/profile/${id}`}
          className="flex flex-row justify-center items-center"
        >
          <img
            src={profilePhoto}
            alt={`${name}'s profile`}
            className="w-16 h-16 rounded-full mr-4"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold hover:underline">{name}</h3>
          </div>
        </Link>
        {!hideStatus && (
          <div>
            {status === "connected" && (
              <span className="text-green-500 font-semibold">Connected</span>
            )}
            {status === "pending" && (
              <>
                {!onAccept && !onDecline ? (
                  <span className="text-yellow-500 font-semibold">Pending</span>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      onClick={onDecline}
                      className="bg-transparent px-4 py-1 text-md font-semibold text-gray-700 shadow-none hover:bg-slate-100"
                    >
                      Ignore
                    </Button>
                    <Button
                      onClick={onAccept}
                      className="bg-transparent px-4 py-1 text-md font-semibold text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50"
                    >
                      Accept
                    </Button>
                  </div>
                )}
              </>
            )}
            {status === "not_connected" && (
              <Button
                onClick={onConnect}
                className="bg-transparent px-4 py-1 text-md font-semibold text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50"
              >
                Connect
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

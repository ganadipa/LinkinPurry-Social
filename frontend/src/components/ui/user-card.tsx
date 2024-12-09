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
  const getButtonText = () => {
    switch (status) {
      case "connected":
        return "Connected";
      case "pending":
        return "Pending";
      default:
        return "Connect";
    }
  };

  const getButtonStyle = () => {
    const baseStyle = "w-full sm:w-auto text-sm sm:text-base font-medium rounded-full transition duration-200 ease-in-out px-4 sm:px-6 py-1.5 sm:py-2";
  
    switch (status) {
      case "connected":
        return `${baseStyle} bg-white text-[#0a66c2] border border-[#0a66c2] hover:bg-[#0a66c2] hover:text-white`;
      case "pending":
        return `${baseStyle} bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-300`;
      case "not_connected":
        return `${baseStyle} bg-[#0a66c2] text-white hover:bg-[#004182]`;
      default:
        return `${baseStyle} bg-[#0a66c2] text-white hover:bg-[#004182]`;
    }
  };

  return (
    <>
      <hr />
      <div className="flex items-center justify-between bg-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg">
        <Link
          href={`/profile/${id}`}
          className="flex flex-1 items-center"
        >
          <img
            src={profilePhoto}
            alt={`${name}'s profile`}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mr-3 sm:mr-4 flex-shrink-0"
          />
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold hover:underline truncate">{name}</h3>
          </div>
        </Link>
        {!hideStatus && (
          <div className="ml-2 flex-shrink-0">
            {status === "connected" && (
              <Button
                className={getButtonStyle()}
                disabled
              >
                {getButtonText()}
              </Button>
            )}
            {status === "pending" && (
              <>
                {!onAccept && !onDecline ? (
                  <Button
                    className={getButtonStyle()}
                    disabled
                  >
                    {getButtonText()}
                  </Button>
                ) : (
                  <div className="flex space-x-1 sm:space-x-2">
                    <Button
                      onClick={onDecline}
                      className="w-auto text-sm sm:text-base font-medium rounded-full px-3 sm:px-4 py-1 sm:py-1.5 bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 transition duration-200"
                    >
                      Ignore
                    </Button>
                    <Button
                      onClick={onAccept}
                      className="w-auto text-sm sm:text-base font-medium rounded-full px-3 sm:px-4 py-1 sm:py-1.5 bg-[#0a66c2] text-white hover:bg-[#004182] transition duration-200"
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
                className={getButtonStyle()}
              >
                {getButtonText()}
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
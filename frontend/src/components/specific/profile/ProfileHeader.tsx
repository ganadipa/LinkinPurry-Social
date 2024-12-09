import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MdEditSquare } from "react-icons/md";
import { Link } from "@tanstack/react-router";
import EditPhotoModals from "@/components/specific/modals/edit-photo";
import EditModals from "@/components/specific/modals/edit-modals-profile";
import { useConnectionStatus } from "@/hooks/connection-status";
import toast from "react-hot-toast";

interface ProfileHeaderProps {
  profile: {
    name: string;
    username: string;
    profile_photo: string;
    connection_count: number;
  };
  user?: { id: number };
  profileId: number;
  isOwnProfile: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  user,
  profileId,
  isOwnProfile,
}) => {
  const { loading, toggleConnection } = useConnectionStatus(
    user?.id || null,
    profileId
  );

  const [status, setStatus] = useState<"connected" | "not_connected" | "pending">("not_connected");

  const getStatus = async () => {
    try {
      const response = await fetch(`/api/connections/status/${profileId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) throw new Error("Failed to fetch connection status");

      const data = await response.json();
      setStatus(data.body.status);
    } catch (error) {
      console.error("Failed to fetch connection status:", error);
      toast.error("Failed to load connection status");
    }
  };

  useEffect(() => {
    if (user) getStatus();
  }, [user, profileId]);

  const [name, setName] = useState<string>(profile.name);
  const [username, setUsername] = useState<string>(profile.username);
  const [photoUrl, setPhotoUrl] = useState<string>(profile.profile_photo);

  const [photoModalOpen, setPhotoModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  const onConnect = async () => {
    if (loading || status == "pending") return;
    await toggleConnection();
    await getStatus();
  };

  const handleUpdate = (newName: string, newUsername: string) => {
    setName(newName);
    setUsername(newUsername);
    toast.success("Name updated successfully");
  };

  const getButtonText = () => {
    if (loading) {
      return "Loading...";
    }
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
    
    if (loading) {
      return `${baseStyle} bg-gray-200 text-gray-600 cursor-not-allowed`;
    }
  
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
      <div className="bg-white rounded-lg shadow border w-full">
        <div className="relative h-32 sm:h-40 md:h-52">
          <img
            src="/images/banner-placeholder.svg"
            alt="Background"
            className="w-full h-full object-cover rounded-t-lg"
          />
          {isOwnProfile && (
            <Button
              variant="ghost"
              className="absolute right-2 top-2 bg-white rounded-md p-1.5 sm:p-2 shadow-sm hover:bg-gray-100"
              onClick={() => setEditModalOpen(true)}
            >
              <span className="hidden sm:inline mr-1">Edit</span>
              <MdEditSquare className="w-4 h-4" />
            </Button>
          )}
        </div>
        <div className="p-4 sm:p-6 -mt-16 sm:-mt-24 md:-mt-32">
          <div className="flex flex-col items-start">
            <div className="relative">
              <img
                src={photoUrl}
                alt="Profile Picture"
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg object-cover cursor-pointer"
                onClick={
                  isOwnProfile ? () => setPhotoModalOpen(true) : undefined
                }
              />
            </div>
          </div>
          <div className="text-start mt-4">
            <h1 className="text-xl sm:text-2xl font-semibold">{name}</h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {username}
            </p>
            <div className="text-blue-500">
              <Link
                to={`/connections/${profileId}`}
                className="text-sm sm:text-base text-blue-500 hover:underline"
              >
                <b>{profile.connection_count}</b> connections
              </Link>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            {user && user.id !== profileId && (
              <Button
              variant="default"
              className={`w-full sm:w-auto rounded-full px-6 py-2 font-medium text-sm ${getButtonStyle()}`}
              onClick={onConnect}
              disabled={loading || status === "pending"}
            >
              {getButtonText()}
            </Button>
            )}
          </div>
        </div>
      </div>

      <EditPhotoModals
        photoModalOpen={photoModalOpen}
        setPhotoModalOpen={setPhotoModalOpen}
        profilePhoto={photoUrl}
        setProfilePhoto={setPhotoUrl}
        userId={user?.id || ""}
        profileId={profileId || ""}
        onEditPhoto={() => {}}
        onDeletePhoto={() => {}}
      />

      <EditModals
        value={{ name, username }}
        isModalOpen={editModalOpen}
        setIsModalOpen={setEditModalOpen}
        userId={user?.id ?? 0}
        onUpdateSuccess={handleUpdate}
      />
    </>
  );
};

export default ProfileHeader;

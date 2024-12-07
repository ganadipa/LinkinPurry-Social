import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MdEditSquare } from "react-icons/md";
import { Link } from "@tanstack/react-router";
import EditPhotoModals from "@/components/specific/edit-photo";
import EditModals from "@/components/specific/edit-modals";
import { useConnectionStatus } from "@/hooks/connection-status";
// import EditProfileModals from "@/components/specific/edit-modals-profile";

interface ProfileHeaderProps {
  profile: {
    name: string;
    username: string;
    profile_photo: string;
    connection_count: number;
    // work_history?: string;
    // skills?: string;
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
  const { status, loading, toggleConnection } = useConnectionStatus(
    user?.id || null,
    profileId
  );

  const [name, setName] = useState<string>(profile.name);
  // const [workHistory, setWorkHistory] = useState<string>(profile.work_history);
  // const [skills, setSkills] = useState<string>(profile.skills);

  const [photoModalOpen, setPhotoModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  const onConnect = async () => {
    if (loading) return;
    await toggleConnection();
  };

  // const handleUpdate = (newName: string, newUsername: string, newWorkHistory: string, newSkills: string) => {
  //   setName(newName);
  //   setUsername(newUsername);
  //   setWorkHistory(newWorkHistory);
  //   setSkills(newSkills);
  // };

  const handleNameUpdate = (newName: string) => {
    setName(newName);
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
                src={profile.profile_photo}
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
            <p className="text-gray-600 text-sm sm:text-base">{profile.username}</p>
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
                className={`w-full sm:w-auto rounded-full ${
                  status
                    ? "bg-white text-[#0a66c2] border border-[#0a66c2] hover:bg-[#0a66c2] hover:text-white"
                    : "bg-[#0a66c2] text-white hover:bg-[#004182]"
                }`}
                onClick={onConnect}
              >
                {status ? "Connected" : "Connect"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditPhotoModals
        photoModalOpen={photoModalOpen}
        setPhotoModalOpen={setPhotoModalOpen}
        profilePhoto={profile.profile_photo}
        userId={user?.id || ""}
        profileId={profileId || ""}
        onEditPhoto={() => {}}
        onDeletePhoto={() => {}}
      />

      {/* <EditProfileModals
          isModalOpen={editModalOpen}
          setIsModalOpen={setEditModalOpen}
          userId={user?.id ?? 0}
          initialData={{
            name: name || '',
            username: username || '',
            work_history: workHistory || '',
            skills: skills || '',
          }}
          onUpdateSuccess={(updatedData) => {
            console.log('Profile updated successfully:', updatedData);
            // Handle UI state or refetch updated data
            handleUpdate(
              updatedData.name || '',
              updatedData.username || '',
              updatedData.work_history || '',
              updatedData.skills || ''
            );
          }}
        /> */}

      <EditModals
        labelModal="Name"
        value={name || ""}
        isModalOpen={editModalOpen}
        setIsModalOpen={setEditModalOpen}
        userId={user?.id ?? 0}
        field="name"
        onUpdateSuccess={handleNameUpdate}
      />
    </>
  );
};

export default ProfileHeader;

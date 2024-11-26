import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MdEditSquare } from "react-icons/md";
import { useAuth } from "@/hooks/auth";
import { Link } from "@tanstack/react-router";
import Loading from "@/components/loading";
import { useProfile } from "@/hooks/profile";
import { useConnectionStatus } from "@/hooks/connection-status";
import EditModals from "@/components/specific/edit-modals";
import EditPhotoModals from "@/components/specific/edit-photo";

export default function ProfilePage2({ id }: { id: number }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  console.log("user: ", user); // debug
  console.log("id is", id);
  const { profile, posts, loading: isProfileLoading } = useProfile(id);
  const { status, loading, toggleConnection } = useConnectionStatus(user?.id || null, id);
  const [statuses, setStatuses] = useState<{ [key: number]: "connected" | "pending" | "not_connected" }>({});

  const [photoModalOpen, setPhotoModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [workHistoryModalOpen, setWorkHistoryModalOpen] = useState<boolean>(false);
  const [skillModalOpen, setSkillModalOpen] = useState<boolean>(false);

  const handleConnect = () => {
    toggleConnection();
    if (status) {
      setStatuses({ ...statuses, [id]: "connected" });
    } else {
      setStatuses({ ...statuses, [id]: "pending" });
    }
  }

  const isLoading = isAuthLoading || isProfileLoading;
  if (isLoading) {
    return <Loading />;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <>
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-lg shadow border">
          <div className="relative h-52">
            <img
              src="/public/images/banner-placeholder.svg"
              alt="Background"
              className="w-full h-full object-cover rounded-t-lg"
            />
            {user?.id === id && (
              <Button
                variant="ghost"
                className="absolute right-0 bg-white rounded-md m-2 p-2 shadow-sm hover:bg-gray-100"
                onClick={() => setEditModalOpen(true)}
              >
                Edit
                <MdEditSquare />
              </Button>
            )}
          </div>
          <div className="p-6 -mt-32">
            <div className="flex flex-col items-start">
              <div className="relative">
                <img
                  src={profile.profile_photo}
                  alt="Profile Picture"
                  className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover cursor-pointer"
                  onClick={() => setPhotoModalOpen(true)}
                />
              </div>
            </div>
            <div className="text-start mt-4">
              <h1 className="text-2xl font-semibold">{profile?.name}</h1>
              <p className="text-gray-600">{profile?.username}</p>
              {/* <p className="text-gray-600">{profile.location}</p> */}
              <Link to={`/connections/${id}`} className="text-blue-500 hover:underline">
                <p className="text-blue-500">
                  <b>{profile.connection_count}</b> connections
                </p>
              </Link>
            </div>
            <div className="mt-4">
              {user && user?.id !== id && (
                <Button
                  variant="default"
                  className={`rounded-full ${
                    status
                      ? "bg-white text-[#0a66c2] border border-[#0a66c2] hover:bg-[#0a66c2] hover:text-white"
                      : "bg-[#0a66c2] text-white hover:bg-[#004182]"
                  }`}
                  onClick={() => handleConnect()}
                >
                  {status ? "Connected" : "Connect"}
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Work History</h2>
            <div className="space-x-2">
              {user?.id === id && (
                <Button
                  variant="ghost"
                  className="bg-white shadow-sm"
                  onClick={() => {
                    // setCurrentExperience(null);
                    setWorkHistoryModalOpen(true); // Tadi yang ini sih sebelum di komen - gana
                  }}
                >
                  Edit
                  <MdEditSquare />
                </Button>
              )}
            </div>
          </div>
          <div>{profile.work_history}</div>
        </div>
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Skills</h2>
            {user?.id === id && (
              <Button
                variant="ghost"
                className="bg-white shadow-sm"
                onClick={() => setSkillModalOpen(true)}
              >
                Edit
                <MdEditSquare />
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {/* {skillsArray.map((skill: string, index: number) => (
              <Badge
                key={index}
                variant="default"
                className="cursor-pointer hover:bg-red-500"
                onClick={() => authenticated ?? handleDeleteSkill(skill)}
              >
                {skill}
              </Badge>
            ))} */}
            {profile.skills}
          </div>
        </div>
        {/* Profile Photo Modal */}
        <EditPhotoModals photoModalOpen={photoModalOpen} setPhotoModalOpen={setPhotoModalOpen} profilePhoto={profile.profile_photo} userId={user?.id || ""} profileId={id || ""} onEditPhoto={() => {}} onDeletePhoto={() => {}} />

        {/* Main Edit Modal */}
        <EditModals labelModal="Name" value={profile.name || ""} isModalOpen={editModalOpen} setIsModalOpen={setEditModalOpen} userId={user?.id ?? 0} field="name" />
        
        {/* Work History Modal */}
        <EditModals labelModal="Work History" value={profile.work_history || ""} isModalOpen={workHistoryModalOpen} setIsModalOpen={setWorkHistoryModalOpen} userId={user?.id ?? 0} field="work_history" />
        
        {/* Skills Modal */}
        <EditModals labelModal="Skill" value={profile.skills || ""} isModalOpen={skillModalOpen} setIsModalOpen={setSkillModalOpen} userId={user?.id ?? 0} field="skills" />
      </div>
    </>
  );
}

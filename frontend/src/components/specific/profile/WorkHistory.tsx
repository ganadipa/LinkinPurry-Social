import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MdEditSquare } from "react-icons/md";
import EditModals from "@/components/specific/modals/edit-modals";
import { useAuth } from "@/hooks/auth";
import toast from "react-hot-toast";
// import { useProfile } from "@/hooks/profile";

interface WorkHistoryProps {
  work_history: string | null;
  isOwnProfile: boolean;
}

const WorkHistory: React.FC<WorkHistoryProps> = ({
  work_history,
  isOwnProfile,
}) => {
  const { user } = useAuth();
  const [workHistoryValue, setWorkHistoryValue] = useState<string>(
    work_history || ""
  );
  const [workHistoryModalOpen, setWorkHistoryModalOpen] =
    useState<boolean>(false);

  const handleWorkHistoryUpdate = (newWorkHistory: string) => {
    setWorkHistoryValue(newWorkHistory);
    toast.success("Work history updated successfully");
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow border p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Work History</h2>
          {isOwnProfile && (
            <Button
              variant="ghost"
              className="bg-white rounded-md p-1.5 sm:p-2 shadow-sm hover:bg-gray-100"
              onClick={() => setWorkHistoryModalOpen(true)}
            >
              <span className="hidden sm:inline mr-1">Edit</span>
              <MdEditSquare className="w-4 h-4" />
            </Button>
          )}
        </div>
        <div className="break-words whitespace-pre-wrap overflow-x-hidden overflow-y-auto max-h-96">
          {workHistoryValue}
        </div>
      </div>

      <EditModals
        labelModal="Work History"
        value={workHistoryValue}
        isModalOpen={workHistoryModalOpen}
        setIsModalOpen={setWorkHistoryModalOpen}
        userId={user?.id ?? 0}
        field="work_history"
        onUpdateSuccess={handleWorkHistoryUpdate}
      />
    </>
  );
};

export default WorkHistory;

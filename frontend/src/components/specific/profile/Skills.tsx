import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MdEditSquare } from "react-icons/md";
import EditModals from "@/components/specific/modals/edit-modals";
import { useAuth } from "@/hooks/auth";
import toast from "react-hot-toast";
// import { useProfile } from "@/hooks/profile";

interface SkillsProps {
  skills: string | null;
  isOwnProfile: boolean;
}

const Skills: React.FC<SkillsProps> = ({ skills, isOwnProfile }) => {
  const { user } = useAuth();

  const [skillsValue, setSkillsValue] = useState<string>(skills || "");
  const [skillModalOpen, setSkillModalOpen] = useState<boolean>(false);

  const handleSkillsUpdate = (newSkills: string) => {
    setSkillsValue(newSkills);
    toast.success("Skills updated successfully");
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow border p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Skills</h2>
          {isOwnProfile && (
            <Button
              variant="ghost"
              className="bg-white rounded-md p-1.5 sm:p-2 shadow-sm hover:bg-gray-100"
              onClick={() => setSkillModalOpen(true)}
            >
              <span className="hidden sm:inline mr-1">Edit</span>
              <MdEditSquare className="w-4 h-4" />
            </Button>
          )}
        </div>
        <div className="break-words whitespace-pre-wrap overflow-x-hidden overflow-y-auto max-h-96">
          {skillsValue}
        </div>
      </div>

      <EditModals
        labelModal="Skills"
        value={skillsValue}
        isModalOpen={skillModalOpen}
        setIsModalOpen={setSkillModalOpen}
        userId={user?.id ?? 0}
        field="skills"
        onUpdateSuccess={handleSkillsUpdate}
      />
    </>
  );
};

export default Skills;

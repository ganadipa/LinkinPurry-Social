import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MdEditSquare } from "react-icons/md";
import EditModals from "@/components/specific/edit-modals";
import { useAuth } from "@/hooks/auth";
// import { useProfile } from "@/hooks/profile";

interface SkillsProps {
  skills: string | null;
  isOwnProfile: boolean;
}

const Skills: React.FC<SkillsProps> = ({
    skills,
    isOwnProfile
}) => {
  const { user } = useAuth();

  const [skillsValue, setSkillsValue] = useState<string>(skills || "" );
  const [skillModalOpen, setSkillModalOpen] = useState<boolean>(false);

  const handleSkillsUpdate = (newSkills: string) => {
    setSkillsValue(newSkills); // Update the state immediately
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Skills</h2>
          {isOwnProfile && (
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
        <div className="flex flex-wrap gap-2">{skillsValue}</div>
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

import { useState, ChangeEvent, FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MdAdd, MdDelete, MdEditSquare, MdFileUpload } from "react-icons/md";
import { useAuth } from "@/hooks/auth";
import { Link } from "@tanstack/react-router";
import { Profile } from "@/types/profile";
import { User } from "@/types/user";

export default function ProfilePage({ id }: { id: number }) {
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [photoModalOpen, setPhotoModalOpen] = useState<boolean>(false);
  const [workHistoryModalOpen, setWorkHistoryModalOpen] = useState<boolean>(false);
  const [skillModalOpen, setSkillModalOpen] = useState<boolean>(false);
  const [newSkill, setNewSkill] = useState<string>("");
  const authenticated = useAuth();
  const [connected, setConnected] = useState<boolean>(true);
  
  const [user] = useState<User | null>(authenticated.user);

  const [profile, setProfile] = useState<Profile>({
    username: "ahmadmudabbir",
    profile_photo: "/public/images/img-placeholder.svg",
    name: "Ahmad Mudabbir Arif",
    work_history:
      "Software Engineer at Tech Corp (2020 - Present)\nJunior Developer at Startup Inc (2018 - 2020)",
    skills: "React, Node.js, TypeScript, GraphQL, AWS",
    connection_count: 100,
  });

  const skillsArray = (profile.skills ?? "").split(",").map((skill) => skill.trim());
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  
  const handleEditPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setProfile({ ...profile, profile_photo: imageUrl });
      setPhotoModalOpen(false);

      console.log("Uploading photo:", file);
      // Example: Perform API request to upload
      // uploadPhoto(file).then((url) => {
      //   setProfile({ ...profile, profile_photo: url });
      // });
    }
  };

  const handleDeletePhoto = () => {
    setProfile({ ...profile, profile_photo: "/public/images/img-placeholder.svg" });
    setPhotoModalOpen(false);
  };

  const handleAddSkill = (e: FormEvent) => {
    e.preventDefault();
    if (newSkill.trim()) {
      setProfile({
        ...profile,
        skills: [...skillsArray, newSkill.trim()].join(", "),
      });
      setNewSkill("");
      setSkillModalOpen(false);
    }
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    setProfile({
      ...profile,
      skills: skillsArray.filter((skill) => skill !== skillToDelete).join(", "),
    });
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    console.log(profile);
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
            {authenticated.user?.id === id && (
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
              <h1 className="text-2xl font-semibold">{user?.name}</h1>
              <p className="text-gray-600">{user?.email}</p>
              {/* <p className="text-gray-600">{profile.location}</p> */}
              <Link to={`/connections/${id}`} className="text-blue-500 hover:underline">
                <p className="text-blue-500">
                  <b>{profile.connection_count}</b> connections
                </p>
              </Link>
            </div>
            <div className="mt-4">
              {authenticated.user && authenticated.user?.id !== id && (
                <Button
                  variant="default"
                  className={`rounded-full ${
                    connected
                      ? "bg-white text-[#0a66c2] border border-[#0a66c2] hover:bg-[#0a66c2] hover:text-white"
                      : "bg-[#0a66c2] text-white hover:bg-[#004182]"
                  }`}
                  onClick={() => setConnected(!connected)}
                >
                  {connected ? "Connected" : "Connect"}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Work History</h2>
            <div className="space-x-2">
              {authenticated.user?.id === id && (
                <Button
                  variant="ghost"
                  className="bg-white shadow-sm"
                  onClick={() => {
                    // setCurrentExperience(null);
                    setWorkHistoryModalOpen(true);
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
            {authenticated.user?.id === id && (
              <div className="space-x-2">
                <Button
                  variant="ghost"
                  className="bg-white shadow-sm"
                  onClick={() => setSkillModalOpen(true)}
                >
                  <MdAdd />
                  Add Skill
                </Button>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {skillsArray.map((skill: string, index: number) => (
              <Badge
                key={index}
                variant="default"
                className="cursor-pointer bg-[#0a66c2] text-white hover:bg-[#004182] rounded-full px-4 py-2"
                onClick={() => authenticated ?? handleDeleteSkill(skill)}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Profile Photo Modal */}
        <Dialog open={photoModalOpen} onOpenChange={setPhotoModalOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Profile Photo</DialogTitle>
            </DialogHeader>
            <DialogDescription />
            <div className="flex flex-col items-center gap-4">
              <img
                src={profile.profile_photo}
                alt="Profile"
                className="w-48 h-48 object-cover"
              />
              {authenticated.user?.id === id && (
                <div className="flex gap-4">
                  <Button onClick={() => document.getElementById('fileInput')?.click()} className="bg-[#0a66c2] text-white hover:bg-[#004182]">
                    Upload Image
                    <MdFileUpload />
                  </Button>
                  <input
                    type="file"
                    id="fileInput"
                    style={{ display: 'none' }}
                    onChange={handleEditPhoto}
                  />
                  <Button variant="destructive" onClick={handleDeletePhoto} className="bg-red-500 text-white hover:bg-red-600">
                    <MdDelete />
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Main Edit Modal */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Edit Company Profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700">Name</label>
                <Input
                  name="name"
                  value={user?.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={user?.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <DialogFooter className="mt-6 flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setEditModalOpen(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  className="bg-[#0a66c2] text-white rounded-full hover:bg-[#004182]"
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Work History Modal */}
        <Dialog open={workHistoryModalOpen} onOpenChange={setWorkHistoryModalOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Edit Company Profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700">Name</label>
                <Input
                  name="name"
                  value={profile.work_history ?? ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <DialogFooter className="mt-6 flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setEditModalOpen(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  className="bg-[#0a66c2] text-white rounded-full hover:bg-[#004182]"
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Skills Modal */}
        <Dialog open={skillModalOpen} onOpenChange={setSkillModalOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Add Skill</DialogTitle>
            </DialogHeader>
            <div className="flex flex-wrap gap-2">
              {skillsArray.map((skill: string, index: number) => (
                <Badge
                  key={index}
                  variant="default"
                  className="cursor-pointer bg-[#0a66c2] text-white hover:bg-[#004182] rounded-full px-4 py-2"
                  onClick={() => handleDeleteSkill(skill)}
                >
                  {skill}
                  <span className="pl-2">&#x2715;</span>
                </Badge>
              ))}
            </div>
            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700">
                  Skill Name
                </label>
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  required
                />
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  variant="default"
                  className="bg-[#0a66c2] text-white rounded-full hover:bg-[#004182]"
                >
                  Add Skill
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

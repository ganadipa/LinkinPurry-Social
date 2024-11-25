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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MdEditSquare, MdAdd } from "react-icons/md";

interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface Profile {
  name: string;
  email: string;
  location: string;
  about: string;
  experiences: Experience[];
  skills: string[];
  profilePicture: string;
  connections: number;
}

export default function Profile() {
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [photoModalOpen, setPhotoModalOpen] = useState<boolean>(false);
  const [experienceModalOpen, setExperienceModalOpen] = useState<boolean>(false);
  const [skillModalOpen, setSkillModalOpen] = useState<boolean>(false);
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(null);
  const [newSkill, setNewSkill] = useState<string>("");
  const [authenticated] = useState<boolean>(true);
  const [connected, setConnected] = useState<boolean>(true);
  
  const [profile, setProfile] = useState<Profile>({
    name: "Ahmad Mudabbir Arif",
    email: "dabbir@example.com",
    location: "Bandung, Indonesia",
    about: "I'm a software engineer with 2 years of experience in building web applications.",
    profilePicture: "/public/images/img-placeholder.svg",
    experiences: [
      {
        title: "Software Engineer",
        company: "Tech Corp",
        duration: "2020 - Present",
        description: "Developing cutting-edge web applications using React and Node.js.",
      },
      {
        title: "Junior Developer",
        company: "Startup Inc",
        duration: "2018 - 2020",
        description: "Worked on various frontend projects and improved UI/UX designs.",
      },
    ],
    skills: ["React", "Node.js", "TypeScript", "GraphQL", "AWS"],
    connections: 100,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleDeletePhoto = () => {
    setProfile({ ...profile, profilePicture: "/public/images/img-placeholder.svg" });
    setPhotoModalOpen(false);
  };

  const handleExperienceSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (currentExperience) {
      const updatedExperiences = profile.experiences.map((exp, index) =>
        index === Number(currentExperience.company) ? currentExperience : exp
      );
      setProfile({ ...profile, experiences: updatedExperiences });
    } else {
      setProfile({
        ...profile,
        experiences: [...profile.experiences, currentExperience!],
      });
    }
    setExperienceModalOpen(false);
    setCurrentExperience(null);
  };

  const handleAddSkill = (e: FormEvent) => {
    e.preventDefault();
    if (newSkill.trim()) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()],
      });
      setNewSkill("");
      setSkillModalOpen(false);
    }
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((skill) => skill !== skillToDelete),
    });
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    console.log(profile);
  }

  return (
    <>
      <div className="max-w-5xl mx-auto mt-16 p-6 space-y-6">
        <div className="bg-white rounded-lg shadow border">
          <div className="relative h-52">
            <img
              src="/public/images/banner-placeholder.svg"
              alt="Background"
              className="w-full h-full object-cover rounded-t-lg"
            />
            {authenticated && (
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
                  src={profile.profilePicture}
                  alt="Profile Picture"
                  className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover cursor-pointer"
                  onClick={() => setPhotoModalOpen(true)}
                />
              </div>
            </div>
            <div className="text-start mt-4">
              <h1 className="text-2xl font-semibold">{profile.name}</h1>
              <p className="text-gray-600">{profile.email}</p>
              <p className="text-gray-600">{profile.location}</p>
              <p className="text-blue-500">
                <b>{profile.connections}</b> connections
              </p>
            </div>
            <div className="mt-4">
              {authenticated && (
                <Button
                  variant="default"
                  className={`rounded-full ${
                    connected
                      ? 'bg-white text-[#0a66c2] border border-[#0a66c2] hover:bg-[#0a66c2] hover:text-white'
                      : 'bg-[#0a66c2] text-white hover:bg-[#004182]'
                  }`}
                  onClick={() => setConnected(!connected)}
                >
                  {connected ? 'Connected' : 'Connect'}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Experience</h2>
            <div className="space-x-2">
              {authenticated && (
                <Button
                  variant="ghost"
                  className="bg-white shadow-sm"
                  onClick={() => {
                    setCurrentExperience(null);
                    setExperienceModalOpen(true);
                  }}
                >
                  <MdAdd className="text-xl mr-1" />
                  Add
                </Button>
              )}
            </div>
          </div>
          {profile.experiences.map((exp, index) => (
            <Card key={index} className="mb-4 relative">
              {authenticated && (
                <Button
                  variant="ghost"
                  className="absolute top-2 right-2 bg-white"
                  onClick={() => {
                    setCurrentExperience({ ...exp, company: index.toString() });
                    setExperienceModalOpen(true);
                  }}
                >
                  <MdEditSquare className="text-xl" />
                </Button>
              )}
              <CardHeader>
                <CardTitle>{exp.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{exp.company} | {exp.duration}</p>
                <p className="mt-2">{exp.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Skills</h2>
            {authenticated && (
              <Button
                variant="ghost"
                className="bg-white shadow-sm"
                onClick={() => setSkillModalOpen(true)}
              >
                <MdAdd className="text-xl mr-1" />
                Add
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <Badge
                key={index}
                variant="default"
                className="cursor-pointer hover:bg-red-500"
                onClick={() => handleDeleteSkill(skill)}
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
            <div className="flex flex-col items-center gap-4">
              <img
                src={profile.profilePicture}
                alt="Profile"
                className="w-48 h-48 rounded-full object-cover"
              />
              <div className="flex gap-4">
                <Button onClick={() => setPhotoModalOpen(false)}>Edit</Button>
                <Button variant="destructive" onClick={handleDeletePhoto}>
                  Delete
                </Button>
              </div>
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
                  value={profile.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">Location</label>
                <Input
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">About</label>
                <Textarea
                  name="about"
                  rows={5}
                  value={profile.about}
                  onChange={handleChange}
                  required
                />
              </div>
              <DialogFooter className="mt-6 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setEditModalOpen(false)} className="text-gray-600 hover:text-gray-800">
                  Cancel
                </Button>
                <Button type="submit" variant="default" className="bg-[#0a66c2] text-white rounded-full hover:bg-[#004182]">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Experience Modal */}
        <Dialog open={experienceModalOpen} onOpenChange={setExperienceModalOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>
                {currentExperience ? "Edit Experience" : "Add Experience"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleExperienceSubmit} className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700">Title</label>
                <Input
                  value={currentExperience?.title || ""}
                  onChange={(e) =>
                    setCurrentExperience({
                      ...currentExperience as Experience,
                      title: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">Company</label>
                <Input
                  value={currentExperience?.company || ""}
                  onChange={(e) =>
                    setCurrentExperience({
                      ...currentExperience as Experience,
                      company: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">Duration</label>
                <Input
                  value={currentExperience?.duration || ""}
                  onChange={(e) =>
                    setCurrentExperience({
                      ...currentExperience as Experience,
                      duration: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">Description</label>
                <Textarea
                  value={currentExperience?.description || ""}
                  onChange={(e) =>
                    setCurrentExperience({
                      ...currentExperience as Experience,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit">Save</Button>
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
            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700">Skill Name</label>
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit">Add Skill</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
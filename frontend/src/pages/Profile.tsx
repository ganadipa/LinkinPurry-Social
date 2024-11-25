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
import { MdEditSquare } from "react-icons/md";

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
}

export default function Profile() {
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile>({
    name: "Ahmad Mudabbir Arif",
    email: "dabbir@example.com",
    location: "Bandung, Indonesia",
    about: "I'm a software engineer with 2 years of experience in building web applications.",
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
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setEditModalOpen(false);
    console.log("Updated Profile:", profile);
  };

  return (
    <>
    <div className="max-w-5xl mx-auto mt-8 p-6 space-y-6">
      <div className="bg-white rounded-lg shadow border">
        <div className="relative h-52">
          <img
            src="/public/images/banner-placeholder.svg"
            alt="Background"
            className="w-full h-full object-cover rounded-t-lg"
          />
          <Button
            variant="ghost"
            className="absolute top-4 right-4 bg-white shadow-md hover:bg-gray-100"
            onClick={() => setEditModalOpen(true)}
          >
            Edit
            <MdEditSquare className="text-2xl" />
          </Button>
        </div>
        <div className="p-6 -mt-16">
          <div className="flex flex-col items-start">
            <img
              src="/public/images/img-placeholder.svg"
              alt="Profile Picture"
              className="absolute w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover"
            />
          </div>
          <div className="text-start mt-44">
            <h1 className="text-2xl font-semibold">{profile.name}</h1>
            <p className="text-gray-600">{profile.email}</p>
            <p className="text-gray-600">{profile.location}</p>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold">About</h2>
            <p className="text-gray-700 mt-2">{profile.about}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border p-6">
        <h2 className="text-xl font-semibold mb-4">Experience</h2>
        {profile.experiences.map((exp, index) => (
          <Card key={index} className="mb-4">
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
        <h2 className="text-xl font-semibold mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill, index) => (
            <Badge key={index} variant="default">{skill}</Badge>
          ))}
        </div>
      </div>

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
    </div>
    </>
  );
}
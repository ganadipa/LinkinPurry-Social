import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MdFileUpload, MdDelete } from "react-icons/md";
import { ErrorSchema } from "@/schemas/error.schema";
import toast from "react-hot-toast";

interface EditPhotoModalsProps {
  photoModalOpen: boolean;
  setPhotoModalOpen: (isOpen: boolean) => void;
  profilePhoto: string;
  userId: string | number;
  profileId: string | number;
  onEditPhoto: () => void;
  onDeletePhoto: () => void;
  setProfilePhoto: (photoUrl: string) => void;
}

export default function EditPhotoModals({
  photoModalOpen,
  setPhotoModalOpen,
  profilePhoto,
  setProfilePhoto,
  userId,
  profileId,
}: EditPhotoModalsProps) {
  const isCurrentUser = userId === profileId;
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(profilePhoto);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedPhoto(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (selectedPhoto) {
        const formData = new FormData();
        formData.append("profile_photo", selectedPhoto);

        const response = await fetch(`/api/profile/${userId}`, {
          method: "PUT",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to update profile photo");
        }

        const data = await response.json();
        
        const error = ErrorSchema.safeParse(data);
        if (error.success) {
          throw new Error(error.data?.message || "Unknown error");
        }

        setProfilePhoto(data.body.profile_photo);
      }

      setPhotoModalOpen(false);
      setSelectedPhoto(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/profile/${userId}/photo`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete profile photo");
      }

      const data = await response.json();
      setProfilePhoto(data.body.profile_photo);
      setPreviewUrl(data.body.profile_photo);
      setPhotoModalOpen(false);
      setSelectedPhoto(null);
    } catch (error) {
      console.error("Error deleting profile photo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedPhoto(null);
    setPreviewUrl(profilePhoto);
    setPhotoModalOpen(false);
  };

  return (
    <Dialog open={photoModalOpen} onOpenChange={setPhotoModalOpen}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Profile Photo</DialogTitle>
        </DialogHeader>
        <DialogDescription />
        <div className="flex flex-col items-center gap-4">
          <img
            src={previewUrl}
            alt="Profile"
            className="w-48 h-48 object-cover rounded-full"
          />
          {isCurrentUser && (
            <div className="flex flex-col gap-4 w-full">
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => document.getElementById("fileInput")?.click()}
                  className="bg-[#0a66c2] text-white hover:bg-[#004182]"
                >
                  Change Image
                  <MdFileUpload className="ml-2" />
                </Button>
                {!selectedPhoto && (
                  <Button
                    onClick={handleDelete}
                    className="bg-white text-[#0a66c2] border border-[#0a66c2] hover:bg-[#f3f6f8]"
                    disabled={isLoading}
                  >
                    Delete Image
                    <MdDelete className="ml-2" />
                  </Button>
                )}
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileSelect}
                />
              </div>
              {selectedPhoto && (
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handleSave}
                    className="bg-[#0a66c2] text-white hover:bg-[#004182]"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    className="bg-white text-[#0a66c2] border border-[#0a66c2] hover:bg-[#f3f6f8]"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

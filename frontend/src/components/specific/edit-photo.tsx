import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'; 
import { Button } from '@/components/ui/button'; 
import { MdFileUpload, MdDelete } from 'react-icons/md';

interface EditPhotoModalsProps {
  photoModalOpen: boolean;
  setPhotoModalOpen: (isOpen: boolean) => void;
  profilePhoto: string;
  userId: string | number;
  profileId: string | number;
  onEditPhoto: () => void;
  onDeletePhoto: () => void;
}

export default function EditPhotoModals({
  photoModalOpen,
  setPhotoModalOpen,
  profilePhoto,
  userId,
  profileId,
  onEditPhoto,
  onDeletePhoto,
}: EditPhotoModalsProps) {
  const isCurrentUser = userId === profileId;

  return (
    <Dialog open={photoModalOpen} onOpenChange={setPhotoModalOpen}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Profile Photo</DialogTitle>
        </DialogHeader>
        <DialogDescription />
        <div className="flex flex-col items-center gap-4">
          <img
            src={profilePhoto}
            alt="Profile"
            className="w-48 h-48 object-cover"
          />
          {isCurrentUser && (
            <div className="flex gap-4">
            <Button onClick={() => document.getElementById('fileInput')?.click()} className="bg-[#0a66c2] text-white hover:bg-[#004182]">
              Upload Image
              <MdFileUpload />
            </Button>
            <input
              type="file"
              id="fileInput"
              style={{ display: 'none' }}
              onChange={onEditPhoto}
            />
            <Button variant="destructive" onClick={onDeletePhoto} className="bg-red-500 text-white hover:bg-red-600">
              <MdDelete />
            </Button>
          </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DialogDescription } from '@radix-ui/react-dialog';
import toast from 'react-hot-toast';
import { ErrorSchema } from '@/schemas/error.schema';

interface EditModalsProps {
  value: {
    name: string;
    username: string;
  };
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  userId: number;
  onUpdateSuccess?: (newName: string, newUsername: string) => void;
}

export default function EditModalsProfile({ 
  value, 
  isModalOpen, 
  setIsModalOpen, 
  userId,
  onUpdateSuccess 
}: EditModalsProps) {
  const [inputUsername, setInputUsername] = useState(value.username);
  const [inputName, setInputName] = useState(value.name);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('username', inputUsername.trim());
      formData.append('name', inputName.trim());
   
      const response = await fetch(`/api/profile/${userId}`, {
        method: 'PUT',
        body: formData
      });
   
      const data = await response.json();
      const error = ErrorSchema.safeParse(data);
      if (error.success) {
        throw new Error(error.data?.message || "Unknown error");
      }

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
   
      if (data.success) {
        onUpdateSuccess?.(data.body.name, data.body.username);
        setIsModalOpen(false); 
      }
   
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
   };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Edit your profile here</DialogTitle>
          <DialogDescription>Make changes to your profile here.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700">
              Name
            </label>
            <Input
              name="name"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">
              Username
            </label>
            <Input
              name="username"
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
              required
            />
          </div>
          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="text-gray-600 hover:text-gray-800 rounded-full"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={isSubmitting}
              className="bg-[#0a66c2] text-white rounded-full hover:bg-[#004182]"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
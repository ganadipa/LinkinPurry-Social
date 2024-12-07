import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DialogDescription } from '@radix-ui/react-dialog';
import axios from 'axios';
import { Profile } from '@/types/profile';

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
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
  
    try {
      const updatePayload: Partial<Profile> = {
        username: inputUsername.trim(),
        name: inputName.trim(),
      };
      const response = await axios.put(`/api/profile/${userId}`, updatePayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      const data = response.data as { success: boolean; message?: string, body?: Profile };
      console.log(data);
  
      if (data.success) {
        onUpdateSuccess?.(inputName, inputUsername);
        setIsModalOpen(false);
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch {
      setError('Error updating profile');
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
          {error && (
            <p className="text-red-500 mt-2">{error}</p>
          )}
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
import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DialogDescription } from '@radix-ui/react-dialog';
import axios from 'axios';

interface EditModalsProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  userId: number;
  initialData: {
    name: string;
    username: string;
    work_history: string;
    skills: string;
  };
  onUpdateSuccess?: (updatedData: Partial<EditModalsProps['initialData']>) => void;
}

export default function EditProfileModals({
  isModalOpen,
  setIsModalOpen,
  userId,
  initialData,
  onUpdateSuccess,
}: EditModalsProps) {
  const [formData, setFormData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof typeof initialData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.put(`/api/profile/${userId}`, formData);
      const data = response.data as { success: boolean; message?: string };

      if (data.success) {
        onUpdateSuccess?.(formData);
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
          <DialogTitle>Edit your profile</DialogTitle>
          <DialogDescription>Update your profile details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700">Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange('name')}
              required
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Username</label>
            <Input
              name="username"
              value={formData.username}
              onChange={handleChange('username')}
              required
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Work History</label>
            <Input
              name="work_history"
              value={formData.work_history}
              onChange={handleChange('work_history')}
              required
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Skills</label>
            <Input
              name="skills"
              value={formData.skills}
              onChange={handleChange('skills')}
              required
            />
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
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

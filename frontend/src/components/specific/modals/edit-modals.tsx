import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogDescription } from "@radix-ui/react-dialog";
import { ErrorSchema } from "@/schemas/error.schema";
import toast from "react-hot-toast";

interface EditModalsProps {
  labelModal: string;
  value: string;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  userId: number;
  field: "name" | "work_history" | "skills";
  onUpdateSuccess?: (newValue: string) => void;
}

export default function EditModals({
  labelModal,
  value,
  isModalOpen,
  setIsModalOpen,
  userId,
  field,
  onUpdateSuccess,
}: EditModalsProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append(field, inputValue);

      const response = await fetch(`/api/profile/${userId}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();
      const error = ErrorSchema.safeParse(data);
      if (error.success) {
        throw new Error(error.data?.message || "Unknown error");
      }

      if (!response.ok) {
        throw new Error("Failed to update work history");
      }

      if (data.success) {
        onUpdateSuccess?.(inputValue);
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
          <DialogDescription>
            Make changes to your profile here.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700">
              {labelModal}
            </label>
            <Input
              name={field}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              required={!["work_history", "skills"].includes(field)}
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

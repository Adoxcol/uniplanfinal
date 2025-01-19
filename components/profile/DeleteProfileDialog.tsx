"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DeleteProfileDialogProps {
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  handleDeleteProfile: () => void;
  loading: boolean;
}

export default function DeleteProfileDialog({
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  handleDeleteProfile,
  loading,
}: DeleteProfileDialogProps) {
  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" type="button" disabled={loading}>
          Delete Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your profile and all associated data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteProfile}>
            Delete Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
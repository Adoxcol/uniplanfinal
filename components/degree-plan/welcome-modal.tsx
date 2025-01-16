'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
  onCreateNewPlan: () => void;
  onBrowseTemplates: () => void;
}

export function WelcomeModal({
  open,
  onClose,
  onCreateNewPlan,
  onBrowseTemplates,
}: WelcomeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome to UniPlan</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Start by creating your own degree plan or browsing templates.
          </p>
          <div className="flex flex-col space-y-2">
            <Button onClick={onCreateNewPlan}>Create New Plan</Button>
            <Button variant="outline" onClick={onBrowseTemplates}>
              Browse Templates
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
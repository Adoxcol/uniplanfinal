

import { Button } from "@/components/ui/button";

interface DegreePlanHeaderProps {
  title: string;
  university: string;
  onSave: () => void;
}

export function DegreePlanHeader({ title, university, onSave }: DegreePlanHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold">{title || "New Plan"}</h1>
        <p className="text-muted-foreground">{university || "No university specified"}</p>
      </div>
      <Button onClick={onSave}>Save Plan</Button>
    </div>
  );
}
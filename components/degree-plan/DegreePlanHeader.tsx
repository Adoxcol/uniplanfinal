"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface DegreePlanHeaderProps {
  title: string;
  university: string;
  onSave: () => void;
  onUpdate: (updatedFields: { title?: string; university?: string }) => void; // Ensure onUpdate is defined
}

export function DegreePlanHeader({ title, university, onSave, onUpdate }: DegreePlanHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingUniversity, setIsEditingUniversity] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedUniversity, setEditedUniversity] = useState(university);

  const handleTitleDoubleClick = () => {
    setIsEditingTitle(true);
  };

  const handleUniversityDoubleClick = () => {
    setIsEditingUniversity(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleUniversityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedUniversity(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    onUpdate({ title: editedTitle }); // Call onUpdate with the updated title
  };

  const handleUniversityBlur = () => {
    setIsEditingUniversity(false);
    onUpdate({ university: editedUniversity }); // Call onUpdate with the updated university
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: "title" | "university") => {
    if (e.key === "Enter") {
      if (field === "title") {
        setIsEditingTitle(false);
        onUpdate({ title: editedTitle }); // Call onUpdate with the updated title
      } else {
        setIsEditingUniversity(false);
        onUpdate({ university: editedUniversity }); // Call onUpdate with the updated university
      }
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        {isEditingTitle ? (
          <input
            type="text"
            value={editedTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKeyDown={(e) => handleKeyDown(e, "title")}
            autoFocus
            className="text-3xl font-bold border border-gray-300 rounded p-1"
          />
        ) : (
          <h1 className="text-3xl font-bold" onDoubleClick={handleTitleDoubleClick}>
            {editedTitle || "New Plan"}
          </h1>
        )}
        {isEditingUniversity ? (
          <input
            type="text"
            value={editedUniversity}
            onChange={handleUniversityChange}
            onBlur={handleUniversityBlur}
            onKeyDown={(e) => handleKeyDown(e, "university")}
            autoFocus
            className="text-muted-foreground border border-gray-300 rounded p-1"
          />
        ) : (
          <p className="text-muted-foreground" onDoubleClick={handleUniversityDoubleClick}>
            {editedUniversity || "No university specified"}
          </p>
        )}
      </div>
      <Button onClick={onSave}>Save Plan</Button>
    </div>
  );
}
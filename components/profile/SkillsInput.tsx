"use client";
import { TagsInput } from "react-tag-input-component";
import { Label } from "@/components/ui/label";

interface SkillsInputProps {
  skills: string; // Comma-separated string of skills
  setSkills: (value: string) => void; // Function to update skills
}

export default function SkillsInput({ skills, setSkills }: SkillsInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="skills">Skills</Label>
      <TagsInput
        value={skills ? skills.split(",").map((skill) => skill.trim()) : []} // Convert string to array for TagsInput
        onChange={(tags) => setSkills(tags.join(","))} // Convert array back to string
        name="skills"
        placeHolder="Add skills (press Enter to add)"
        classNames={{
          tag: "bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100",
          input: "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100",
        }}
      />
    </div>
  );
}
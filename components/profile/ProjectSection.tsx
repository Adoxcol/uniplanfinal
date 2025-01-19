"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagsInput } from "react-tag-input-component";
import { Label } from "../ui/label";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
}

interface ProjectsSectionProps {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
}

export default function ProjectsSection({ projects, setProjects }: ProjectsSectionProps) {
  const addProject = () => {
    setProjects([...projects, { id: Date.now(), title: "", description: "", image: "", tags: [] }]);
  };

  const updateProject = (index: number, field: keyof Project, value: string | string[]) => {
    const updatedProjects = [...projects];
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value,
    };
    setProjects(updatedProjects);
  };

  const removeProject = (index: number) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    setProjects(updatedProjects);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="projects">Projects</Label>
      {projects.map((project, index) => (
        <div key={project.id} className="space-y-4 p-4 border rounded-lg bg-white dark:bg-gray-700">
          <Input
            placeholder="Project Title"
            value={project.title}
            onChange={(e) => updateProject(index, "title", e.target.value)}
          />
          <Textarea
            placeholder="Project Description"
            value={project.description}
            onChange={(e) => updateProject(index, "description", e.target.value)}
          />
          <Input
            placeholder="Image URL"
            value={project.image}
            onChange={(e) => updateProject(index, "image", e.target.value)}
          />
          <TagsInput
            value={project.tags || []}
            onChange={(tags) => updateProject(index, "tags", tags)}
            placeHolder="Add tags (press Enter to add)"
            classNames={{
              tag: "bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100",
              input: "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100",
            }}
          />
          <Button type="button" variant="destructive" onClick={() => removeProject(index)} className="w-full">
            Remove Project
          </Button>
        </div>
      ))}
      <Button type="button" onClick={addProject} className="w-full">
        Add Project
      </Button>
    </div>
  );
}
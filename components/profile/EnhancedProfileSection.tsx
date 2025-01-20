import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, X, Edit2, Trash2, Save } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Project } from '@/types/profile';

// Enhanced Skills Input Component
interface EnhancedSkillsInputProps {
  skills: string[];
  setSkills: React.Dispatch<React.SetStateAction<string[]>>;
}

export const EnhancedSkillsInput = ({ skills, setSkills }: EnhancedSkillsInputProps) => {
  const [newSkill, setNewSkill] = useState<string>("");

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Add a skill..."
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
          className="flex-1"
        />
        <Button 
          type="button"
          onClick={handleAddSkill}
          className="whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <Badge 
            key={index} 
            variant="secondary"
            className="px-3 py-1 text-sm flex items-center gap-2 animate-fade-in"
          >
            {skill}
            <X
              className="w-3 h-3 cursor-pointer hover:text-red-500 transition-colors"
              onClick={() => handleRemoveSkill(skill)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
};

// Enhanced Projects Section Component
interface EnhancedProjectsSectionProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

export const EnhancedProjectsSection = ({ projects, setProjects }: EnhancedProjectsSectionProps) => {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({
    title: "",
    description: "",
    image: "",
    tags: []
  });
  const [newTag, setNewTag] = useState<string>("");

  const handleAddProject = () => {
    if (newProject.title.trim()) {
      setProjects([...projects, { ...newProject, id: Date.now() }]);
      setNewProject({ title: "", description: "", image: "", tags: [] });
    }
  };

  const handleUpdateProject = (id: number) => {
    if (!editingProject) return;
    
    setProjects(projects.map(p => p.id === id ? editingProject : p));
    setEditingProject(null);
  };

  const handleDeleteProject = (id: number) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleAddTag = (projectId: number | null) => {
    if (!newTag.trim()) return;

    if (projectId && editingProject) {
      setEditingProject({
        ...editingProject,
        tags: [...editingProject.tags, newTag.trim()]
      });
    } else {
      setNewProject({
        ...newProject,
        tags: [...newProject.tags, newTag.trim()]
      });
    }
    setNewTag("");
  };

  const handleRemoveTag = (projectId: number | null, tagToRemove: string) => {
    if (projectId && editingProject) {
      setEditingProject({
        ...editingProject,
        tags: editingProject.tags.filter(tag => tag !== tagToRemove)
      });
    } else {
      setNewProject({
        ...newProject,
        tags: newProject.tags.filter(tag => tag !== tagToRemove)
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 border-dashed">
        <CardContent className="space-y-4">
          <Input
            placeholder="Project Title"
            value={newProject.title}
            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
          />
          <Textarea
            placeholder="Project Description"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          />
          <Input
            placeholder="Project Image URL"
            value={newProject.image}
            onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
          />
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag(null)}
            />
            <Button 
              type="button" 
              onClick={() => handleAddTag(null)}
              variant="outline"
            >
              Add Tag
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {newProject.tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline"
                className="px-3 py-1 text-sm flex items-center gap-2"
              >
                {tag}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-red-500 transition-colors"
                  onClick={() => handleRemoveTag(null, tag)}
                />
              </Badge>
            ))}
          </div>
          <Button 
            type="button" 
            onClick={handleAddProject}
            className="w-full"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <CardContent className="p-4 space-y-4">
              {editingProject?.id === project.id ? (
                <>
                  <Input
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  />
                  <Textarea
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  />
                  <Input
                    value={editingProject.image}
                    onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Add tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag(project.id)}
                    />
                    <Button 
                      type="button" 
                      onClick={() => handleAddTag(project.id)}
                      variant="outline"
                    >
                      Add Tag
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="aspect-video relative overflow-hidden rounded-lg">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <p className="text-muted-foreground">{project.description}</p>
                </>
              )}
              
              <div className="flex flex-wrap gap-2">
                {(editingProject?.id === project.id ? editingProject.tags : project.tags)?.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className="px-3 py-1 text-sm flex items-center gap-2"
                  >
                    {tag}
                    {editingProject?.id === project.id && (
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-red-500 transition-colors"
                        onClick={() => handleRemoveTag(project.id, tag)}
                      />
                    )}
                  </Badge>
                ))}
              </div>
              
              <div className="flex justify-end gap-2">
                {editingProject?.id === project.id ? (
                  <Button 
                    type="button" 
                    onClick={() => handleUpdateProject(project.id)}
                    variant="outline"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    onClick={() => setEditingProject(project)}
                    variant="outline"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
                <Button 
                  type="button" 
                  onClick={() => handleDeleteProject(project.id)}
                  variant="destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
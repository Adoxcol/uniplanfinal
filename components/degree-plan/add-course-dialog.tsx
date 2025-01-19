"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";
import { Course } from "@/types/types";

// Function to generate UUID v4
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

interface AddCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  semester: number | null;
  degreePlanId: string;
  onCourseAdd: (course: Course) => void;
  onCourseEdit: (course: Course) => void;
  courseToEdit: Course | null;
}

export function AddCourseDialog({
  open,
  onOpenChange,
  semester,
  degreePlanId,
  onCourseAdd,
  onCourseEdit,
  courseToEdit,
}: AddCourseDialogProps) {
  const [courseData, setCourseData] = useState<Course>({
    id: generateUUID(),
    degree_plan_id: degreePlanId,
    code: "",
    name: "",
    credits: 0,
    semester: semester || 1,
    section: "",
    timing: "",
    difficulty: 1,
    grade: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const supabase = createClient();

  useEffect(() => {
    if (courseToEdit) {
      setCourseData(courseToEdit);
    } else {
      setCourseData({
        id: generateUUID(),
        degree_plan_id: degreePlanId,
        code: "",
        name: "",
        credits: 0,
        semester: semester || 1,
        section: "",
        timing: "",
        difficulty: 1,
        grade: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  }, [courseToEdit, semester, degreePlanId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!courseData.code || !courseData.name) {
      toast({
        title: "Error",
        description: "Please fill in the Course Code and Course Name",
        variant: "destructive",
      });
      return;
    }
  
    try {
      if (courseToEdit) {
        const { error } = await supabase
          .from("courses")
          .update({
            ...courseData,
            updated_at: new Date().toISOString()
          })
          .eq("id", courseToEdit.id);
  
        if (error) throw error;
  
        onCourseEdit(courseData);
        toast({
          title: "Success",
          description: "Course updated successfully",
        });
      } else {
        const newCourse = {
          ...courseData,
          id: generateUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from("courses")
          .insert([newCourse])
          .select()
          .single();
  
        if (error) throw error;
  
        onCourseAdd(data);
        toast({
          title: "Success",
          description: "Course added successfully",
        });
      }
  
      setCourseData({
        id: generateUUID(),
        degree_plan_id: degreePlanId,
        code: "",
        name: "",
        credits: 0,
        semester: semester || 1,
        section: "",
        timing: "",
        difficulty: 1,
        grade: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
  
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving course:", error);
      toast({
        title: "Error",
        description: "Failed to save course",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{courseToEdit ? `Edit Course` : `Add Course`} to Semester {semester}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Course Code</Label>
                <Input
                  id="code"
                  placeholder="CS101"
                  value={courseData.code}
                  onChange={(e) => setCourseData({ ...courseData, code: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Course Name</Label>
                <Input
                  id="name"
                  placeholder="Introduction to Programming"
                  value={courseData.name}
                  onChange={(e) => setCourseData({ ...courseData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="credits">Credits</Label>
              <Input
                id="credits"
                type="number"
                placeholder="3"
                value={courseData.credits || ""}
                onChange={(e) => setCourseData({ ...courseData, credits: Number(e.target.value) })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="section">Section (Optional)</Label>
                <Input
                  id="section"
                  placeholder="A1"
                  value={courseData.section || ""}
                  onChange={(e) => setCourseData({ ...courseData, section: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timing">Class Timing (Optional)</Label>
                <Input
                  id="timing"
                  placeholder="e.g., MWF 09:00-10:20"
                  value={courseData.timing || ""}
                  onChange={(e) => setCourseData({ ...courseData, timing: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Course Difficulty (Optional)</Label>
              <Slider
                value={[courseData.difficulty || 1]}
                onValueChange={([value]) => setCourseData({ ...courseData, difficulty: value })}
                max={5}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Easy</span>
                <span>Medium</span>
                <span>Hard</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">Grade (Optional)</Label>
              <Input
                id="grade"
                placeholder="A, B+, C, etc."
                value={courseData.grade || ""}
                onChange={(e) => setCourseData({ ...courseData, grade: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{courseToEdit ? "Update Course" : "Add Course"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
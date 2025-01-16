'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface AddCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  semester: number | null;
  onCourseAdd: (course: CourseData) => void;
  onCourseEdit: (course: CourseData) => void;
  courseToEdit: CourseData | null; // Prop to receive course data for editing
}

interface CourseData {
  id?: string; // Optional: if this is for editing an existing course
  code: string;
  name: string;
  credits: number; // Updated to number to match schema
  semester: number; // Added semester field
  section?: string; // Optional: section field
  timing?: string; // Optional: timing field
  difficulty?: number; // Optional: difficulty field
  grade?: string; // Optional: grade field
}

export function AddCourseDialog({
  open,
  onOpenChange,
  semester,
  onCourseAdd,
  onCourseEdit,
  courseToEdit,
}: AddCourseDialogProps) {
  const [courseData, setCourseData] = useState<CourseData>({
    code: '',
    name: '',
    credits: 0,
    semester: semester || 1,
    section: '',
    timing: '',
    difficulty: 1,
    grade: '', // New grade field
  });

  // Preload course data when editing
  useEffect(() => {
    if (courseToEdit) {
      setCourseData(courseToEdit);
    } else {
      // Reset form if no course is selected for editing
      setCourseData({
        code: '',
        name: '',
        credits: 0,
        semester: semester || 1,
        section: '',
        timing: '',
        difficulty: 1,
        grade: '', // Reset grade field
      });
    }
  }, [courseToEdit, semester]); // This runs when courseToEdit or semester changes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation for required fields (code and name)
    if (!courseData.code || !courseData.name) {
      alert('Please fill in the Course Code and Course Name');
      return;
    }

    if (courseToEdit) {
      // Edit existing course
      onCourseEdit(courseData);
    } else {
      // Add new course
      onCourseAdd(courseData);
    }

    // Reset the form after submission
    setCourseData({
      code: '',
      name: '',
      credits: 0,
      semester: semester || 1,
      section: '',
      timing: '',
      difficulty: 1,
      grade: '', // Reset grade field
    });

    // Close the dialog
    onOpenChange(false);
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
                value={courseData.credits || ''}
                onChange={(e) => setCourseData({ ...courseData, credits: Number(e.target.value) })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="section">Section (Optional)</Label>
                <Input
                  id="section"
                  placeholder="A1"
                  value={courseData.section || ''}
                  onChange={(e) => setCourseData({ ...courseData, section: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timing">Class Timing (Optional)</Label>
                <Input
                  id="timing"
                  placeholder="e.g., MWF 09:00-10:20"
                  value={courseData.timing || ''}
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
                value={courseData.grade || ''}
                onChange={(e) => setCourseData({ ...courseData, grade: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{courseToEdit ? 'Update Course' : 'Add Course'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
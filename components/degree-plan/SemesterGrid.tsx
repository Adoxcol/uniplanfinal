
"use client";
import { SemesterCard } from "@/components/degree-plan/semester-card";
import { Course } from "@/types/types";

// Assuming you have a shared types file

interface SemesterGridProps {
  courses: Course[];
  onAddCourse: (semester: number) => void;
  onDeleteCourse: (courseId: string) => void;
  onEditCourse: (course: Course) => void;
}

export function SemesterGrid({ courses, onAddCourse, onDeleteCourse, onEditCourse }: SemesterGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {[1, 2, 3, 4].map((semester) => (
        <SemesterCard
          key={semester}
          semester={semester}
          courses={courses.filter((course) => course.semester === semester)}
          onAddCourse={() => onAddCourse(semester)}
          onDeleteCourse={onDeleteCourse}
          onEditCourse={onEditCourse}
        />
      ))}
    </div>
  );
}
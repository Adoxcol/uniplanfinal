"use client";
import { SemesterCard } from "@/components/degree-plan/semester-card";
import { Course } from "@/types/types";

interface SemesterGridProps {
  courses: Course[];
  semesters: number[]; // Add semesters as a prop
  onAddCourse: (semester: number) => void;
  onDeleteCourse: (courseId: string) => void;
  onEditCourse: (course: Course) => void;
}

export function SemesterGrid({
  courses,
  semesters, // Destructure semesters from props
  onAddCourse,
  onDeleteCourse,
  onEditCourse,
}: SemesterGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {semesters.map((semester) => (
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
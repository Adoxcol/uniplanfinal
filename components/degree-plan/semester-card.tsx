'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Plus, Edit, Trash, Clock } from 'lucide-react';
import { Course } from '@/types/types'; // Import the shared Course type

interface SemesterCardProps {
  semester: number;
  courses: Course[]; // Use the shared Course type
  onAddCourse: () => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
}

function CourseItem({ 
  course, 
  onEditCourse, 
  onDeleteCourse 
}: { 
  course: Course; 
  onEditCourse: (course: Course) => void; 
  onDeleteCourse: (courseId: string) => void; 
}) {
  return (
    <Card className="p-3">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium">{course.code}</div>
              <div className="text-sm text-muted-foreground">{course.name}</div>
            </div>
            <div className="text-sm">
              <span className="font-medium">{course.grade}</span>
              <span className="text-muted-foreground ml-2">{course.credits} cr</span>
            </div>
          </div>
          <div className="mt-2 space-y-2">
            {course.timing && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>{course.timing}</span>
              </div>
            )}
            {course.difficulty !== undefined && (
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Difficulty</div>
                <Slider
                  defaultValue={[course.difficulty]}
                  max={5}
                  step={1}
                  className="w-[120px]"
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col space-y-2 justify-between items-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditCourse(course)}
            className="text-blue-500"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDeleteCourse(course.id)}
            className="text-red-500"
          >
            <Trash className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function SemesterCard({
  semester,
  courses,
  onAddCourse,
  onEditCourse,
  onDeleteCourse,
}: SemesterCardProps) {
  const totalCredits = courses.reduce((acc, course) => acc + course.credits, 0);

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Semester {semester}</h3>
        <div className="text-sm text-muted-foreground">{totalCredits} Credits</div>
      </div>
      <div className="space-y-3">
        {courses.length === 0 ? (
          <div className="text-center text-muted-foreground">No courses added yet.</div>
        ) : (
          courses.map((course) => (
            <CourseItem
              key={course.id}
              course={course}
              onEditCourse={onEditCourse}
              onDeleteCourse={onDeleteCourse}
            />
          ))
        )}
        <Button variant="outline" className="w-full" onClick={onAddCourse}>
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>
    </Card>
  );
}
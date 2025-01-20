'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '../ui/progress';
import { Course, Grade } from '@/types/types'; // Import shared types

interface DegreeStatsProps {
  courses?: Course[];
  maxCredits?: number;
}

export function DegreeStats({ courses = [], maxCredits = 120 }: DegreeStatsProps) {
  // Calculate total credits
  const totalCredits = courses.reduce((acc, course) => acc + course.credits, 0);

  // Calculate GPA
  const calculateGpa = (courses: Course[]): string => {
    const gradePoints = courses.reduce((acc, course) => {
      if (course.grade && course.grade !== 'W') {
        const gradeValue = {
          'A': 4.0,
          'B': 3.0,
          'C': 2.0,
          'D': 1.0,
          'F': 0.0,
        }[course.grade] || 0;
        return acc + gradeValue * course.credits;
      }
      return acc;
    }, 0);

    const totalGpaCredits = courses.reduce((acc, course) => 
      acc + (course.grade && course.grade !== 'W' ? course.credits : 0), 0
    );
    return totalGpaCredits > 0 ? (gradePoints / totalGpaCredits).toFixed(2) : '0.00';
  };

  const gpa = calculateGpa(courses);

  // Calculate completion percentage
  const completionPercentage = Math.round((totalCredits / maxCredits) * 100);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total Credits Card */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm">Total Credits</h3>
        <div className="mt-2">
          <div className="text-2xl font-bold">{totalCredits}/{maxCredits}</div>
          <Progress value={(totalCredits / maxCredits) * 100} className="mt-2" />
        </div>
      </Card>

      {/* Current GPA Card */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm">Current GPA</h3>
        <div className="mt-2">
          <div className="text-2xl font-bold">{gpa}</div>
          <Progress value={(parseFloat(gpa) / 4.0) * 100} className="mt-2" />
        </div>
      </Card>

      {/* Completion Card */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm">Completion</h3>
        <div className="mt-2">
          <div className="text-2xl font-bold">{completionPercentage}%</div>
          <Progress value={completionPercentage} className="mt-2" />
        </div>
      </Card>
    </div>
  );
}
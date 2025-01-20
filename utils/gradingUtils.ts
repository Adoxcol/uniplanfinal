// gradingUtils.ts

import { Course } from "@/types/types";

// Define grading systems for different universities
export const universityGradingSystems = {
  NSU: {
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'C-': 1.7,
    'D+': 1.3,
    'D': 1.0,
    'F': 0.0,
  },
  BRAC: {
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'D': 1.0,
    'F': 0.0,
  },
  IUB: {
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'D': 1.0,
    'F': 0.0,
  },
  AIUB: {
    'A+': 4.0,
    'A': 3.75,
    'A-': 3.5,
    'B+': 3.25,
    'B': 3.0,
    'B-': 2.75,
    'C+': 2.5,
    'C': 2.25,
    'D': 2.0,
    'F': 0.0,
  },
  EWU: {
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'D': 1.0,
    'F': 0.0,
  },
  UIU: {
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'D': 1.0,
    'F': 0.0,
  },
  ULAB: {
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'D': 1.0,
    'F': 0.0,
  },
  DIU: {
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'D': 1.0,
    'F': 0.0,
  },
  STAMFORD: {
    'A': 4.0,
    'B': 3.0,
    'C': 2.0,
    'D': 1.0,
    'F': 0.0,
  },
  GREEN: {
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'D': 1.0,
    'F': 0.0,
  },
};

// Function to calculate GPA based on the selected university
export const calculateGpa = (
  courses: Course[],
  university: keyof typeof universityGradingSystems
): string => {
  const gradingSystem = universityGradingSystems[university];

  const gradePoints = courses.reduce((acc, course) => {
    if (course.grade && course.grade !== 'W') {
      const gradeValue = gradingSystem[course.grade] || 0;
      return acc + gradeValue * course.credits;
    }
    return acc;
  }, 0);

  const totalGpaCredits = courses.reduce((acc, course) => 
    acc + (course.grade && course.grade !== 'W' ? course.credits : 0), 0
  );

  return totalGpaCredits > 0 ? (gradePoints / totalGpaCredits).toFixed(2) : '0.00';
};
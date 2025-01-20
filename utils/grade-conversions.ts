// utils/grade-conversions.ts
import { Grade } from "@/types/types";

export const gradeToPoints = (grade: Grade | null): number => {
  if (!grade) return 0;
  switch(grade) {
    case 'A': return 4.0;
    case 'B': return 3.0;
    case 'C': return 2.0;
    case 'D': return 1.0;
    default: return 0;
  }
};
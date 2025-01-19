export interface Course {
  id: string; // Unique identifier for the course
  code: string; // Course code (e.g., "CS101")
  name: string; // Course name (e.g., "Introduction to Computer Science")
  credits: number; // Number of credits the course is worth
  semester: number; // Semester number (e.g., 1, 2, 3, 4)
  grade?: string; // Optional: Grade received in the course (e.g., "A", "B", "C")
  section?: string; // Optional: Section of the course (e.g., "01", "02")
  timing?: string; // Optional: Timing or schedule of the course (e.g., "MWF 10:00 AM - 11:00 AM")
  difficulty?: number; // Optional: Difficulty level of the course (e.g., 1 to 5)
}
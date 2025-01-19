// types.ts

// Course type
export interface Course {
  id: string; // Unique identifier for the course
  degree_plan_id: string; // ID of the degree plan this course belongs to
  code: string; // Course code (e.g., "CS101")
  name: string; // Course name (e.g., "Introduction to Computer Science")
  credits: number; // Number of credits the course is worth
  semester: number; // Semester number (e.g., 1, 2, 3, 4)
  grade?: string; // Optional: Grade received in the course (e.g., "A", "B", "C")
  section?: string; // Optional: Section of the course (e.g., "01", "02")
  timing?: string; // Optional: Timing or schedule of the course (e.g., "MWF 10:00 AM - 11:00 AM")
  difficulty?: number; // Optional: Difficulty level of the course (e.g., 1 to 5)
  created_at: string; // Timestamp when the course was created
  updated_at: string; // Timestamp when the course was last updated
}

// DegreePlan type
export interface DegreePlan {
  id: string; // Unique identifier for the degree plan
  user_id: string; // ID of the user who created the degree plan
  title: string; // Title of the degree plan (e.g., "Computer Science Degree Plan")
  description?: string; // Optional: Description of the degree plan
  total_credits: number; // Total credits required for the degree plan
  cumulative_gpa?: string; // Optional: Cumulative GPA for the degree plan
  semester_gpa?: string; // Optional: Semester GPA for the degree plan
  is_public: boolean; // Whether the degree plan is public
  is_template: boolean; // Whether the degree plan is a template
  created_at: string; // Timestamp when the degree plan was created
  updated_at: string; // Timestamp when the degree plan was last updated
  university?: string; // Optional: University name (e.g., "Stanford University")
  notes?: string; // Optional: Notes or additional information about the degree plan
}

// Plan type
export interface Plan {
  plan_id: string; // Unique identifier for the plan
  name: string; // Name of the plan
  code: string; // Code of the plan
  credits: number; // Number of credits for the plan
  semester: string; // Semester for the plan
  grade?: string; // Optional: Grade for the plan
  section?: string; // Optional: Section of the plan
  timing?: string; // Optional: Timing or schedule of the plan
  created_at: string; // Timestamp when the plan was created
  updated_at: string; // Timestamp when the plan was last updated
  status?: string; // Optional: Status of the plan
  difficulty?: string; // Optional: Difficulty level of the plan
  profile_id: string; // ID of the profile associated with the plan
}

// Profile type
export interface Profile {
  id: string; // Unique identifier for the profile
  username: string; // Username of the profile
  full_name?: string; // Optional: Full name of the profile
  email: string; // Email of the profile
  event_url?: string; // Optional: Event URL associated with the profile
  created_at: string; // Timestamp when the profile was created
  bio?: string; // Optional: Bio of the profile
  education?: string; // Optional: Education information of the profile
  skills?: string; // Optional: Skills of the profile
  projects?: string; // Optional: Projects of the profile
  avatar_url?: string; // Optional: Avatar URL of the profile
}


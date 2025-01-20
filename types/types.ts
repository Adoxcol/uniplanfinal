export type Grade = 'A' | 'B' | 'C' | 'D' | 'F' | 'W' | null;  // Use null instead of undefined
export type GradeOrUndefined = Grade | undefined;
export interface Course {
  id: string;
  degree_plan_id: string;
  code: string;
  name: string;
  credits: number;
  semester: number;
  grade?: Grade; // This is the crucial type definition
  section?: string;
  timing?: string;
  difficulty?: number;
  created_at: string;
  updated_at: string;
}

export interface DegreePlan {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  total_credits: number;
  cumulative_gpa?: number;  // Changed to number type
  semester_gpa?: number;    // Changed to number type
  is_public: boolean;
  is_template: boolean;
  created_at: string;
  updated_at: string;
  university?: string;
  notes?: string;
}

export interface Plan {
  plan_id: string;
  name: string;
  code: string;
  credits: number;
  semester: number;  // Changed from string to number
  grade?: Grade;     // Changed to Grade type to match Course
  section?: string;
  timing?: string;
  created_at: string;
  updated_at: string;
  status?: string;
  difficulty?: number;  // Changed from string to number
  profile_id: string;
}

export interface Profile {
  id: string;
  username: string;
  full_name?: string;
  email: string;
  event_url?: string;
  created_at: string;
  bio?: string;
  education?: string;
  skills?: string[];  // Changed from string to array
  projects?: string[]; // Changed from string to array
  avatar_url?: string;
}

export interface Rating {  // Added export
  id: string;
  plan_id: string;
  user_id: string;
  stars: number;
  created_at: string;
}
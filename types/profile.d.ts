export interface Profile {
  id: string;
  avatar_url?: string;
  full_name?: string;
  email?: string;
  bio?: string;
  education?: string;
  skills?: string[];
  projects?: Project[];
  username?: string;
  updated_at?: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
}
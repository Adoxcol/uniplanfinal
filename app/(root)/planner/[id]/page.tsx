// app/planner/[id]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { PlannerContent } from "@/components/degree-plan/planner-content";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PlannerPage({ params }: PageProps) {
  // Wait for params to be available
  const { id } = await params;
  
  // Create the Supabase client
  const supabase = await createClient();

  // Fetch degree plan
  const { data: degreePlan, error: degreePlanError } = await supabase
    .from("degree_plans")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (degreePlanError || !degreePlan) {
    return <div>Degree plan not found</div>;
  }

  // Fetch courses for the degree plan
  const { data: courses, error: coursesError } = await supabase
    .from("courses")
    .select("*")
    .eq("degree_plan_id", id);

  if (coursesError) {
    return <div>Failed to fetch courses</div>;
  }

  return <PlannerContent initialDegreePlan={degreePlan} initialCourses={courses || []} />;
}
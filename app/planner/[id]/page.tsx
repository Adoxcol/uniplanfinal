// app/planner/[id]/page.tsx
import { DegreePlanHeader } from "@/components/degree-plan/DegreePlanHeader";
import { SemesterGrid } from "@/components/degree-plan/SemesterGrid";
import { NotesPanel } from "@/components/degree-plan/NotesPanel";
import { DegreeStats } from "@/components/degree-plan/degree-stats";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

import { createClient } from "@/utils/supabase/server";
import { AddCourseDialog } from "@/components/degree-plan/add-course-dialog";

export default async function PlannerPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { id } = params;

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

  return (
    <div className="container py-6">
      <DegreePlanHeader
        title={degreePlan.title || "New Plan"}
        university={degreePlan.university || "No university specified"}
        onSave={async () => {
          // Handle saving the degree plan
        }}
      />

      <ResizablePanelGroup direction="horizontal" className="min-h-[800px] rounded-lg border">
        <ResizablePanel defaultSize={75}>
          <div className="flex h-full">
            <div className="flex-1 p-6">
              <DegreeStats courses={courses || []} />
              <SemesterGrid
                courses={courses || []}
                onAddCourse={(semester) => {
                  // Handle adding a course
                }}
                onDeleteCourse={async (courseId) => {
                  // Handle deleting a course
                }}
                onEditCourse={(course) => {
                  // Handle editing a course
                }}
              />
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={25}>
          <NotesPanel
            notes={degreePlan.notes ? JSON.parse(degreePlan.notes) : []}
            newNote=""
            onNoteChange={() => {}}
            onNoteAdd={() => {}}
            onNoteDelete={() => {}}
          />
        </ResizablePanel>
      </ResizablePanelGroup>

      <AddCourseDialog
        open={false}
        onOpenChange={() => {}}
        semester={null}
        courseToEdit={null}
        onCourseAdd={() => {}}
        onCourseEdit={() => {}}
      />
    </div>
  );
}
'use client'; // Ensure this is a client component

import { useState, useEffect } from 'react';
import { DegreePlanHeader } from "@/components/degree-plan/DegreePlanHeader";
import { SemesterGrid } from "@/components/degree-plan/SemesterGrid";
import { NotesPanel } from "@/components/degree-plan/NotesPanel";
import { DegreeStats } from "@/components/degree-plan/degree-stats";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Course } from "@/types/types";
import { supabase } from '@/lib/supbaseClient';
import { AddCourseDialog } from './add-course-dialog';

interface PlannerContentProps {
  initialDegreePlan: any;
  initialCourses: Course[];
}

export function PlannerContent({ initialDegreePlan, initialCourses }: PlannerContentProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);
  const [notes, setNotes] = useState<string[]>(initialDegreePlan.notes ? JSON.parse(initialDegreePlan.notes) : []);
  const [newNote, setNewNote] = useState("");
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [semesters, setSemesters] = useState<number[]>(
    initialDegreePlan.semesters || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  );
  const [isPublic, setIsPublic] = useState(initialDegreePlan.is_public || false);

  useEffect(() => {
    // Optionally, perform any actions when the component mounts or updates
  }, [courses, semesters, notes]);

  const handleAddCourse = (semester: number) => {
    setSelectedSemester(semester);
    setCourseToEdit(null); // Reset course to edit
    setIsDialogOpen(true); // Open dialog
  };

  const handleEditCourse = (course: Course) => {
    setCourseToEdit(course); // Set the course to edit
    setSelectedSemester(course.semester); // Set the selected semester
    setIsDialogOpen(true); // Open dialog
  };

  const handleCourseAdd = (course: Course) => {
    setCourses(prevCourses => [...prevCourses, course]); // Add the new course to the list
  };

  const handleCourseEdit = (updatedCourse: Course) => {
    setCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === updatedCourse.id ? updatedCourse : course
      )
    ); // Edit the existing course in the list
  };

  const handleDeleteCourse = async (courseId: string) => {
    setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId)); // Remove course from the list
  };

  const handleAddSemester = () => {
    if (semesters.length < 15) { // Limit to 8 semesters
      setSemesters(prevSemesters => {
        const nextSemester = prevSemesters.length > 0 ? Math.max(...prevSemesters) + 1 : 1;
        return [...prevSemesters, nextSemester]; // Add the next semester number
      });
    } else {
      alert("Maximum number of semesters reached (8).");
    }
  };

  const handleSaveDegreePlan = async () => {
    try {
      // Save the degree plan
      const { data: degreePlan, error: degreePlanError } = await supabase
        .from("degree_plans")
        .upsert([
          {
            id: initialDegreePlan.id, // Use the existing ID if updating, or insert if creating a new plan
            title: initialDegreePlan.title,
            university: initialDegreePlan.university,
            is_public: isPublic,
            notes: JSON.stringify(notes), // Store notes as a JSON string
            semesters,
          },
        ])
        .select()
        .single();
  
      if (degreePlanError) {
        throw new Error(degreePlanError.message);
      }
  
      // Save courses in the `courses` table
      const { error: coursesError } = await supabase
        .from("courses")
        .upsert(
          courses.map((course) => ({
            ...course,
            degree_plan_id: degreePlan.id, // Link courses to the degree plan
          }))
        );
  
      if (coursesError) {
        throw new Error(coursesError.message);
      }
  
      alert("Degree plan and courses saved successfully!");
      console.log("Saved Degree Plan:", degreePlan);
    } catch (error) {
      alert("Error saving degree plan: " + error.message);
      console.error(error);
    }
  };

  return (
    <div className="container py-6">
      <DegreePlanHeader
        title={initialDegreePlan.title || "New Plan"}
        university={initialDegreePlan.university || "No university specified"}
        onSave={handleSaveDegreePlan} // Save button handler
      />

      <div className="mb-4">
        <button
          onClick={handleAddSemester}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Semester
        </button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={() => setIsPublic(!isPublic)} // Toggle public/private state
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">
            Make Plan Public
          </span>
        </label>
      </div>

      <ResizablePanelGroup direction="horizontal" className="min-h-[800px] rounded-lg border">
        <ResizablePanel defaultSize={75}>
          <div className="flex h-full">
            <div className="flex-1 p-6">
              <DegreeStats courses={courses} />
              <SemesterGrid
                courses={courses}
                semesters={semesters}
                onAddCourse={handleAddCourse}
                onDeleteCourse={handleDeleteCourse}
                onEditCourse={handleEditCourse}
              />
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={25}>
          <NotesPanel
            notes={notes}
            newNote={newNote}
            onNoteChange={setNewNote}
            onNoteAdd={() => {
              if (newNote.trim()) {
                setNotes(prevNotes => [...prevNotes, newNote.trim()]);
                setNewNote("");
              }
            }}
            onNoteDelete={(index) => {
              setNotes(prevNotes => prevNotes.filter((_, i) => i !== index));
            }}
          />
        </ResizablePanel>
      </ResizablePanelGroup>

      <AddCourseDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        semester={selectedSemester}
        degreePlanId={initialDegreePlan.id} // Pass degreePlanId to link courses
        courseToEdit={courseToEdit}
        onCourseAdd={handleCourseAdd}
        onCourseEdit={handleCourseEdit}
      />
    </div>
  );
}
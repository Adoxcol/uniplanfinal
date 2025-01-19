// app/actions.ts
"use server";

import { Course } from "@/types/types";
import { createClient } from "@/utils/supabase/server";


export async function addCourse(newCourse: Course) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .insert([newCourse])
    .select()
    .single();

  if (error) {
    throw new Error("Failed to add course");
  }

  return data;
}
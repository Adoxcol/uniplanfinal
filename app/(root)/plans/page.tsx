"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { v4 as uuidv4 } from "uuid"; // Import UUID library

interface Plan {
  id: string;
  title: string;
  university?: string;
  total_credits: number;
  cumulative_gpa: string;
  created_at: string;
}

export default function PlansPage() {
  const supabase = createClient();
  const router = useRouter();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [planTitle, setPlanTitle] = useState("");
  const [planUniversity, setPlanUniversity] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);

  // Fetch saved plans on component mount
  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          toast({
            title: "Error",
            description: "No authenticated user found.",
            variant: "destructive",
          });
          router.push("/login");
          return;
        }

        const { data: plans, error } = await supabase
          .from("degree_plans")
          .select("*")
          .eq("user_id", user.id);

        if (error) throw error;

        setPlans(plans || []);
      } catch (error) {
        console.error("Error fetching plans:", error);
        toast({
          title: "Error",
          description: "Failed to fetch plans.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [supabase, router]);

  // Handle creating a new plan
  const handleCreatePlan = async () => {
    if (!planTitle) {
      toast({
        title: "Error",
        description: "Plan title is required.",
        variant: "destructive",
      });
      return;
    }

    if (plans.length >= 3) {
      toast({
        title: "Error",
        description: "You can only have a maximum of 3 plans.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast({
          title: "Error",
          description: "No authenticated user found.",
          variant: "destructive",
        });
        router.push("/login");
        return;
      }

      const newPlanId = uuidv4();

      const { data: newPlan, error } = await supabase
        .from("degree_plans")
        .insert([
          {
            id: newPlanId,
            user_id: user.id,
            title: planTitle,
            university: planUniversity,
            total_credits: 0, // Initialize total credits to 0
            cumulative_gpa: "0.0", // Initialize CGPA to "0.0"
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setPlans([...plans, newPlan]);
      setPlanTitle("");
      setPlanUniversity("");
      setIsModalOpen(false);

      toast({
        title: "Success",
        description: "Plan created successfully!",
      });
    } catch (error) {
      console.error("Error creating plan:", error);
      toast({
        title: "Error",
        description: "Failed to create plan.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a plan
  const handleDeletePlan = async (planId: string) => {
    setDeletingPlanId(planId);
    try {
      const { error } = await supabase.from("degree_plans").delete().eq("id", planId);

      if (error) throw error;

      setPlans(plans.filter((plan) => plan.id !== planId));

      toast({
        title: "Success",
        description: "Plan deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast({
        title: "Error",
        description: "Failed to delete plan.",
        variant: "destructive",
      });
    } finally {
      setDeletingPlanId(null);
    }
  };

  // Handle updating a plan's title, university, total credits, or CGPA
  const handleUpdatePlan = async (
    planId: string,
    updatedFields: {
      title?: string;
      university?: string;
      total_credits?: number;
      cumulative_gpa?: string;
    }
  ) => {
    try {
      const { error } = await supabase
        .from("degree_plans")
        .update(updatedFields)
        .eq("id", planId);

      if (error) throw error;

      setPlans((prevPlans) =>
        prevPlans.map((plan) =>
          plan.id === planId ? { ...plan, ...updatedFields } : plan
        )
      );

      toast({
        title: "Success",
        description: "Plan updated successfully!",
      });
    } catch (error) {
      console.error("Error updating plan:", error);
      toast({
        title: "Error",
        description: "Failed to update plan.",
        variant: "destructive",
      });
    }
  };

  // Navigate to the planner page for a specific plan
  const handlePlanClick = (planId: string) => {
    router.push(`/planner/${planId}`);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">My Degree Plans</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className="bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <CardHeader>
                <EditableText
                  text={plan.title}
                  onSave={(newText) => handleUpdatePlan(plan.id, { title: newText })}
                  className="text-gray-900 dark:text-gray-100 font-bold text-xl"
                />
              </CardHeader>
              <CardContent>
                <EditableText
                  text={plan.university || "No university specified"}
                  onSave={(newText) => handleUpdatePlan(plan.id, { university: newText })}
                  className="text-gray-700 dark:text-gray-300"
                />
                <p className="text-gray-700 dark:text-gray-300">Total Credits: {plan.total_credits}</p>
                <p className="text-gray-700 dark:text-gray-300">Cumulative GPA: {plan.cumulative_gpa}</p>
                <p className="text-gray-700 dark:text-gray-300">
                  Created: {new Date(plan.created_at).toLocaleDateString()}
                </p>
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={() => handlePlanClick(plan.id)}>
                    Open
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeletePlan(plan.id)}
                    disabled={deletingPlanId === plan.id}
                  >
                    {deletingPlanId === plan.id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {plans.length < 3 && (
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Card className="bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                  <CardContent className="flex items-center justify-center h-32">
                    <span className="text-4xl text-gray-900 dark:text-gray-100">+</span>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="bg-white dark:bg-gray-800">
                <DialogHeader>
                  <DialogTitle>Create New Plan</DialogTitle>
                  <DialogDescription>
                    Enter the title and university for your new degree plan.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="plan-title">Plan Title</Label>
                    <Input
                      id="plan-title"
                      value={planTitle}
                      onChange={(e) => setPlanTitle(e.target.value)}
                      placeholder="e.g., Computer Science Degree"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plan-university">University</Label>
                    <Input
                      id="plan-university"
                      value={planUniversity}
                      onChange={(e) => setPlanUniversity(e.target.value)}
                      placeholder="e.g., Stanford University"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePlan} disabled={loading}>
                    {loading ? "Creating..." : "Create Plan"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </main>
    </div>
  );
}

// EditableText Component for Double-Click Editing
interface EditableTextProps {
  text: string;
  onSave: (newText: string) => void;
  className?: string;
}

function EditableText({ text, onSave, className }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onSave(editedText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      onSave(editedText);
    }
  };

  return (
    <div onDoubleClick={handleDoubleClick}>
      {isEditing ? (
        <input
          type="text"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className={`w-full bg-transparent border-b border-gray-300 focus:outline-none ${className}`}
        />
      ) : (
        <span className={className}>{text}</span>
      )}
    </div>
  );
}
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

        // Fetch plans from the degree_plans table
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

      // Generate a UUID for the new plan
      const newPlanId = uuidv4();

      // Insert new plan into the degree_plans table
      const { data: newPlan, error } = await supabase
        .from("degree_plans")
        .insert([
          {
            id: newPlanId, // Explicitly provide the UUID
            user_id: user.id,
            title: planTitle,
            university: planUniversity,
            total_credits: 0, // Default value
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Update the plans state
      setPlans([...plans, newPlan]);

      // Reset form and close modal
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

  // Navigate to the planner page for a specific plan
  const handlePlanClick = (planId: string) => {
    router.push(`/planner/${planId}`);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">My Degree Plans</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Display existing plans */}
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className="bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handlePlanClick(plan.id)} // Make the card clickable
            >
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">{plan.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  {plan.university || "No university specified"}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Total Credits: {plan.total_credits}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Created: {new Date(plan.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}

          {/* Add new plan card */}
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
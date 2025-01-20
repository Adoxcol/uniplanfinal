'use client';
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Search, Copy, User } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Add type definitions
interface Rating {
  stars: number;
}

interface Profile {
  username?: string;
}

interface DegreePlan {
  id: string;
  title: string;
  university: string;
  description: string;
  is_public: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
  ratings: Rating[];
  profiles?: Profile;
  duplicates?: number;
}

interface PlanWithRating extends DegreePlan {
  averageRating: number;
  username: string;
}

export default function TemplatePage() {
  const [plans, setPlans] = useState<PlanWithRating[]>([]);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchPublicPlans();
  }, []);

  const fetchPublicPlans = async () => {
    const { data: publicPlans, error } = await supabase
      .from("degree_plans")
      .select(`
        *,
        ratings (stars),
        profiles (username)
      `)
      .eq("is_public", true);

    if (error) {
      console.error("Error fetching plans:", error);
      return;
    }

    const plansWithAverageRatings = publicPlans.map((plan: any) => {
      const totalStars = plan.ratings.reduce((sum: number, rating: Rating) => sum + rating.stars, 0);
      const averageRating = plan.ratings.length ? totalStars / plan.ratings.length : 0;
      return {
        ...plan,
        averageRating,
        username: plan.profiles?.username || "Unknown",
      } as PlanWithRating;
    });

    setPlans(plansWithAverageRatings);
  };

  const handleDuplicatePlan = async (planId: string) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        toast({
          title: "Error",
          description: "You must be logged in to duplicate a plan.",
          variant: "destructive",
        });
        return;
      }

      const { data: plan, error: planError } = await supabase
        .from("degree_plans")
        .select("*")
        .eq("id", planId)
        .single();

      if (planError || !plan) {
        toast({
          title: "Error",
          description: "Failed to fetch the plan.",
          variant: "destructive",
        });
        return;
      }

      const { data: newPlan, error: insertError } = await supabase
        .from("degree_plans")
        .insert([{
          ...plan,
          id: crypto.randomUUID(),
          user_id: user.id,
          is_public: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Plan duplicated successfully!",
      });

      router.push(`/planner/${newPlan.id}`);
    } catch (error) {
      console.error("Error duplicating plan:", error);
      toast({
        title: "Error",
        description: "Failed to duplicate the plan.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Public Degree Plans</h1>
        <p className="text-muted-foreground">
          Browse and use degree plans created by other students and faculty.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search plans..."
          className="pl-10 bg-background"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
            <CardHeader className="space-y-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-xl">{plan.title}</h3>
                  <p className="text-sm text-muted-foreground">{plan.university}</p>
                </div>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Copy className="w-4 h-4" />
                  <span>{plan.duplicates || 0}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground line-clamp-2">{plan.description}</p>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{plan.username}</span> {/* Display the username */}
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span className="font-medium">Average Rating:</span>
                <span>{plan.averageRating.toFixed(1)} ⭐</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleDuplicatePlan(plan.id)} className="w-full">
                Use Template
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  </div>
);
}
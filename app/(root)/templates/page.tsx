'use client';
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function TemplatePage() {
  const [plans, setPlans] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    fetchPublicPlans();
  }, []);

  const fetchPublicPlans = async () => {
    const { data: publicPlans, error } = await supabase
      .from("degree_plans")
      .select(`
        *,
        ratings (stars)
      `)
      .eq("is_public", true);

    if (error) {
      console.error("Error fetching plans:", error);
      return;
    }

    const plansWithAverageRatings = publicPlans.map((plan) => {
      const totalStars = plan.ratings.reduce((sum, rating) => sum + rating.stars, 0);
      const averageRating = totalStars / plan.ratings.length || 0;
      return {
        ...plan,
        averageRating,
      };
    });

    setPlans(plansWithAverageRatings);
  };

  const handleRatePlan = async (planId, stars) => {
    try {
      await ratePlan(planId, stars);
      fetchPublicPlans(); // Refresh the list after rating
    } catch (error) {
      console.error("Error rating plan:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Public Degree Plans</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{plan.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {plan.description}
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">University:</span> {plan.university}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">Total Credits:</span> {plan.total_credits}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">Average Rating:</span>{" "}
                {plan.averageRating.toFixed(1)} ⭐
              </p>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Rate this plan:</p>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatePlan(plan.id, star)}
                    className="text-yellow-400 hover:text-yellow-500 focus:outline-none"
                  >
                    {star} ⭐
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
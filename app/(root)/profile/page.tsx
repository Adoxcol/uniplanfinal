import ProfileForm from "@/components/profile/ProfileForm";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Fetch the authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // Redirect to login if the user is not authenticated
  if (userError || !user) {
    redirect("/login");
  }

  // Fetch the user's profile data
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
    redirect("/error"); // Redirect to an error page or handle the error
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        {/* Pass profile data to the Client Component */}
        <ProfileForm profile={profile} />
      </main>
    </div>
  );
}

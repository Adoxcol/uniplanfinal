"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteProfileDialog from "@/components/profile/DeleteProfileDialog";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileImageUploader from "@/components/profile/ProfileImageUploader";
import ProjectsSection from "@/components/profile/ProjectSection";
import SkillsInput from "@/components/profile/SkillsInput";
import { Button } from "@/components/ui/button";
import { Project } from "next/dist/build/swc/types";


export default function EditProfilePage() {
  const supabase = createClient();
  const router = useRouter();

  const [profileImage, setProfileImage] = useState("/placeholder.svg");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUsernameEditable, setIsUsernameEditable] = useState(true);

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
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

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        setProfileImage(profile.avatar_url || "/placeholder.svg");
        setFullName(profile.full_name || "");
        setEmail(profile.email || "");
        setBio(profile.bio || "");
        setEducation(profile.education || "");
        setSkills(Array.isArray(profile.skills) ? profile.skills.join(", ") : "");
        setProjects(Array.isArray(profile.projects) ? profile.projects : []);
        setUsername(profile.username || "");

        if (profile.username) {
          setIsUsernameEditable(false);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to fetch profile data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [supabase, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Error",
        description: "Email is required.",
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

      const processedSkills = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      const updatedProfile = {
        id: user.id,
        full_name: fullName,
        email: email,
        bio,
        education,
        skills: processedSkills,
        projects: projects,
        avatar_url: profileImage,
        username: username,
      };

      const { error } = await supabase.from("profiles").upsert(updatedProfile);

      if (error) {
        console.error("Supabase error:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      router.push("/profile");
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase.from("profiles").delete().eq("id", user.id);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Profile deleted successfully!",
        });
        router.push("/");
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <ProfileImageUploader
                profileImage={profileImage}
                setProfileImage={setProfileImage}
                fullName={fullName}
              />
              <ProfileForm
                fullName={fullName}
                setFullName={setFullName}
                email={email}
                bio={bio}
                setBio={setBio}
                education={education}
                setEducation={setEducation}
                isUsernameEditable={isUsernameEditable}
                username={username}
                setUsername={setUsername}
              />
              <SkillsInput skills={skills} setSkills={setSkills} />
              <ProjectsSection projects={projects} setProjects={setProjects} />
              <div className="flex justify-between">
                <DeleteProfileDialog
                  isDeleteDialogOpen={isDeleteDialogOpen}
                  setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                  handleDeleteProfile={handleDeleteProfile}
                  loading={loading}
                />
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => router.push("/profile")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
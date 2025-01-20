"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteProfileDialog from "@/components/profile/DeleteProfileDialog";
import ProfileForm from "@/components/profile/ProfileForm";
import ProjectsSection from "@/components/profile/ProjectSection";
import SkillsInput from "@/components/profile/SkillsInput";
import { Button } from "@/components/ui/button";
import { Project } from "next/dist/build/swc/types";
import AvatarUpload from "@/components/profile/AvatarUpload";
import { User } from "@supabase/supabase-js";

export default function EditProfilePage() {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
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
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          toast({
            title: "Error",
            description: "No authenticated user found.",
            variant: "destructive",
          });
          router.push("/login");
          return;
        }

        setUser(user);

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        // Get fresh image URL with cache busting
        const avatarUrl = profile.avatar_url 
          ? `${profile.avatar_url}?${Date.now()}`
          : "/placeholder.svg";

        setProfileImage(avatarUrl);
        setFullName(profile.full_name || "");
        setEmail(profile.email || "");
        setBio(profile.bio || "");
        setEducation(profile.education || "");
        setSkills(Array.isArray(profile.skills) ? profile.skills.join(", ") : "");
        setProjects(Array.isArray(profile.projects) ? profile.projects : []);
        setUsername(profile.username || "");

        if (profile.username) setIsUsernameEditable(false);
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
  }, [supabase, router, refreshKey]); // Add refreshKey to dependencies

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Error",
        description: "No authenticated user found.",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const processedSkills = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      const updatedProfile = {
        id: user.id,
        full_name: fullName,
        email,
        bio,
        education,
        skills: processedSkills,
        projects,
        avatar_url: profileImage.split('?')[0], // Remove cache busting parameter
        username,
      };

      const { error } = await supabase.from("profiles").upsert(updatedProfile);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      
      // Force refresh of data with cache busting
      setRefreshKey(prev => prev + 1);
      router.refresh(); // Refresh Next.js router cache

    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!user) return;

    try {
      // Delete avatar from storage
      if (profileImage && profileImage.startsWith('http')) {
        const filePath = profileImage.split('/').pop()?.split('?')[0];
        if (filePath) {
          await supabase.storage
            .from('avatars')
            .remove([filePath]);
        }
      }

      // Delete profile from database
      const { error } = await supabase.from("profiles").delete().eq("id", user.id);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile deleted successfully!",
      });
      router.push("/");
    } catch (error) {
      console.error("Error deleting profile:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete profile",
        variant: "destructive",
      });
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
              <AvatarUpload
                uid={user?.id || ""}
                url={profileImage}
                onUpload={(newUrl) => {
                  setProfileImage(`${newUrl}?${Date.now()}`); // Immediate update with cache bust
                  setRefreshKey(prev => prev + 1); // Force data refresh
                }}
                className="mb-8"
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
                    disabled={loading}
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
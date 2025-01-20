"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteProfileDialog from "@/components/profile/DeleteProfileDialog";
import ProfileForm from "@/components/profile/ProfileForm";
import { Button } from "@/components/ui/button";
import AvatarUpload from "@/components/profile/AvatarUpload";
import { EnhancedProjectsSection, EnhancedSkillsInput } from "@/components/profile/EnhancedProfileSection";
import { useProfile } from '@/context/ProfileContext'; // Import the profile context

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
}

export default function EditProfilePage() {
  const supabase = createClient();
  const router = useRouter();
  const { profile: contextProfile, setProfile: setContextProfile } = useProfile(); // Use profile context

  const [profileImage, setProfileImage] = useState("/placeholder.svg");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUsernameEditable, setIsUsernameEditable] = useState(true);

  // Initialize form with context profile data
  useEffect(() => {
    if (contextProfile) {
      const avatarUrl = contextProfile.avatar_url 
        ? `${contextProfile.avatar_url}?${Date.now()}`
        : "/placeholder.svg";

      setProfileImage(avatarUrl);
      setFullName(contextProfile.full_name || "");
      setEmail(contextProfile.email || "");
      setBio(contextProfile.bio || "");
      setEducation(contextProfile.education || "");
      setSkills(Array.isArray(contextProfile.skills) ? contextProfile.skills : []);
      setProjects(Array.isArray(contextProfile.projects) ? contextProfile.projects : []);
      setUsername(contextProfile.username || "");

      if (contextProfile.username) setIsUsernameEditable(false);
    }
  }, [contextProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contextProfile) {
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
      const updatedProfile = {
        id: contextProfile.id,
        full_name: fullName,
        email,
        bio,
        education,
        skills,
        projects,
        avatar_url: profileImage.split('?')[0],
        username,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("profiles")
        .upsert(updatedProfile)
        .select()
        .single();

      if (error) throw error;

      // Update context profile
      setContextProfile(data);

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });

      router.push("/profile");
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
    if (!contextProfile) return;

    try {
      if (profileImage && profileImage.startsWith('http')) {
        const filePath = profileImage.split('/').pop()?.split('?')[0];
        if (filePath) {
          await supabase.storage
            .from('avatars')
            .remove([filePath]);
        }
      }

      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", contextProfile.id);

      if (error) throw error;

      // Clear context profile
      setContextProfile(null);

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
                uid={contextProfile?.id || ""}
                url={profileImage}
                onUpload={(newUrl) => {
                  setProfileImage(`${newUrl}?${Date.now()}`);
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
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Skills</h3>
                  <EnhancedSkillsInput skills={skills} setSkills={setSkills} />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Projects</h3>
                  <EnhancedProjectsSection projects={projects} setProjects={setProjects} />
                </div>
              </div>
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
// app/edit-profile/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function EditProfilePage() {
  const supabase = createClient();
  const router = useRouter();

  const [profileImage, setProfileImage] = useState("/placeholder.svg");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");
  const [projects, setProjects] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUsernameUnique, setIsUsernameUnique] = useState(true);

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
        setProjects(JSON.stringify(profile.projects || [], null, 2));
        setUsername(profile.username || "");
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

  // Handle username uniqueness check
  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setUsername(newUsername);

    if (newUsername) {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", newUsername)
        .single();

      setIsUsernameUnique(!data || data.username === username);
    }
  };

  // Handle profile image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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
          return;
        }

        const filePath = `${user.id}/avatar-${Date.now()}`;
        const { data, error } = await supabase.storage
          .from("avatars")
          .upload(filePath, file);

        if (error) {
          console.error("Error uploading image:", error);
          toast({
            title: "Error",
            description: "Failed to upload image.",
            variant: "destructive",
          });
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(data.path);

        setProfileImage(publicUrlData.publicUrl);

        // Update avatar URL in the profiles table
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ avatar_url: publicUrlData.publicUrl })
          .eq("id", user.id);

        if (updateError) {
          console.error("Error updating avatar URL:", updateError);
          toast({
            title: "Error",
            description: "Failed to update profile.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Avatar updated successfully!",
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          title: "Error",
          description: "Failed to process or upload image.",
          variant: "destructive",
        });
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      if (!isUsernameUnique) {
        toast({
          title: "Error",
          description: "Username is already taken.",
          variant: "destructive",
        });
        return;
      }

      // Validate projects JSON
      let parsedProjects;
      try {
        parsedProjects = JSON.parse(projects || "[]");
      } catch (error) {
        toast({
          title: "Error",
          description: "Invalid projects format. Ensure it is valid JSON.",
          variant: "destructive",
        });
        return;
      }

      // Update profile
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: fullName,
        email,
        bio,
        education,
        skills: skills.split(",").map((skill) => skill.trim()),
        projects: parsedProjects,
        avatar_url: profileImage,
        username,
      });

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

  // Handle profile deletion
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
    <div className="min-h-screen w-full bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage src={profileImage} alt="Profile picture" />
                  <AvatarFallback>{fullName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="profile-image"
                  />
                  <Label
                    htmlFor="profile-image"
                    className="cursor-pointer text-blue-600 hover:underline"
                  >
                    Change Profile Picture
                  </Label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={handleUsernameChange}
                    required
                  />
                  {!isUsernameUnique && (
                    <p className="text-red-600 text-sm">Username is already taken.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane.doe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">About Me</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Textarea
                  id="education"
                  placeholder="Your educational background"
                  rows={3}
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input
                  id="skills"
                  placeholder="Python, Java, Machine Learning"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projects">Projects</Label>
                <Textarea
                  id="projects"
                  placeholder="Describe your projects"
                  rows={4}
                  value={projects}
                  onChange={(e) => setProjects(e.target.value)}
                />
              </div>

              <div className="flex justify-between">
                <Dialog
                  open={isDeleteDialogOpen}
                  onOpenChange={setIsDeleteDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="destructive" type="button" disabled={loading}>
                      Delete Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete
                        your profile and all associated data.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsDeleteDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleDeleteProfile}>
                        Delete Profile
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
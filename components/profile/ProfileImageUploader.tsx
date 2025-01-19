"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileImageUploaderProps {
  profileImage: string;
  setProfileImage: (url: string) => void;
  fullName: string;
}

export default function ProfileImageUploader({
  profileImage,
  setProfileImage,
  fullName,
}: ProfileImageUploaderProps) {
  const supabase = createClient();

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

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-800 shadow-lg">
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
          className="cursor-pointer text-blue-600 hover:underline dark:text-blue-400"
        >
          Change Profile Picture
        </Label>
      </div>
    </div>
  );
}
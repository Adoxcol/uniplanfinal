import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import imageCompression from "browser-image-compression";
import { uploadImage } from "@/utils/supabase/storage/client";

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
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Log the file details for debugging
      console.log("File before compression:", file);
      console.log("Original file size:", file.size);

      // Compress the image and convert it to WebP
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        fileType: "image/webp", // WebP conversion
      });

      // Log the compressed file details
      console.log("Compressed file:", compressedFile);
      console.log("Compressed file size:", compressedFile.size);

      // Upload image to Supabase
      const { imageUrl, error } = await uploadImage({
        file: compressedFile,
        bucket: "avatars", // Replace with your actual bucket name
      });

      if (error) {
        console.error("Supabase error:", error);
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
        return;
      }

      // Log the image URL after upload
      console.log("Image URL:", imageUrl);

      // Update the profile image in the state
      setProfileImage(imageUrl);

      // Optionally: You can update the profile image in Supabase profiles table here

      toast({
        title: "Success",
        description: "Profile picture updated successfully!",
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "An error occurred during the image upload process.",
        variant: "destructive",
      });
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

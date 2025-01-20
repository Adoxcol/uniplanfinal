import { v4 as uuidv4 } from "uuid";
import imageCompression from "browser-image-compression";
import { createClient } from "../client";

function getStorage() {
  const { storage } = createClient();
  return storage;
}

type UploadProps = {
  file: File;
  bucket: string;
  folder?: string;
};

export const uploadImage = async ({ file, bucket, folder }: UploadProps) => {
  const fileName = file.name;
  const fileExtension = fileName.slice(fileName.lastIndexOf(".") + 1).toLowerCase();
  const path = `${folder ? folder + "/" : ""}${uuidv4()}.${fileExtension}`;

  try {
    // Compress the image (keep your existing code)
    file = await imageCompression(file, { maxSizeMB: 1 });

    const storage = getStorage();
    
    // Upload to Supabase
    const { data, error } = await storage.from(bucket).upload(path, file);

    if (error) {
      return { imageUrl: "", error: error.message }; // Return Supabase's error message
    }

    // Get the public URL using Supabase's method
    const { data: publicUrlData } = storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { 
      imageUrl: publicUrlData.publicUrl, 
      error: "" 
    };

  } catch (error) {
    console.error(error);
    return { imageUrl: "", error: "Image upload failed" };
  }
};
export const deleteImage = async (imageUrl: string) => {
  const bucketAndPathString = imageUrl.split("/storage/v1/object/public/")[1];
  const firstSlashIndex = bucketAndPathString.indexOf("/");

  const bucket = bucketAndPathString.slice(0, firstSlashIndex);
  const path = bucketAndPathString.slice(firstSlashIndex + 1);

  const storage = getStorage();

  try {
    const { data, error } = await storage.from(bucket).remove([path]);

    if (error) {
      console.error("Supabase delete error:", error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error during deletion:", error);
    return { data: null, error: "An unexpected error occurred" };
  }
};
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/components/ui/use-toast";
import imageCompression from "browser-image-compression";

interface AvatarUploadProps {
  uid: string;
  url: string | null;
  onUpload: (url: string) => void;
  size?: number;
  className?: string;
}

export default function AvatarUpload({
  uid,
  url,
  onUpload,
  size = 128,
  className
}: AvatarUploadProps) {
  const supabase = createClient();
  const [avatarUrl, setAvatarUrl] = useState(url || "/placeholder.svg");
  const [uploading, setUploading] = useState(false);

  // Add cache busting to initial URL
  useEffect(() => {
    const initialUrl = url ? `${url}?${new Date().getTime()}` : "/placeholder.svg";
    setAvatarUrl(initialUrl);
  }, [url]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: size * 2,
        useWebWorker: true,
        fileType: 'image/webp'
      });

      const filePath = `${uid}/${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}.webp`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, compressedFile);

      if (uploadError) throw uploadError;

      // Get URL with cache busting
      const publicUrl = `${supabase.storage
        .from('avatars')
        .getPublicUrl(filePath).data.publicUrl}?${Date.now()}`;

      // Update both local and parent state
      setAvatarUrl(publicUrl);
      onUpload(publicUrl);

      toast({ title: "Success!", description: "Avatar updated successfully" });

    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive"
      });
      setAvatarUrl("/placeholder.svg");
    } finally {
      setUploading(false);
      if (event.target) event.target.value = '';
    }
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div 
        className="relative rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-sm bg-gray-100 dark:bg-gray-800"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          minWidth: `${size}px`
        }}
      >
        <img
          src={avatarUrl}
          alt="User avatar"
          className="object-cover w-full h-full"
          width={size}
          height={size}
          onError={() => setAvatarUrl("/placeholder.svg")}
          key={avatarUrl} // Force re-render on URL change
        />
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-sm font-medium">Uploading...</span>
          </div>
        )}
      </div>
      
      <label className="cursor-pointer text-sm font-medium text-primary hover:text-primary/80 transition-colors">
        {uploading ? 'Uploading...' : 'Change Avatar'}
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>
    </div>
  );
}
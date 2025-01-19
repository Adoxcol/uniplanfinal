"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProfileFormProps {
  fullName: string;
  setFullName: (value: string) => void;
  email: string;
  bio: string;
  setBio: (value: string) => void;
  education: string;
  setEducation: (value: string) => void;
  isUsernameEditable: boolean;
  username: string;
  setUsername: (value: string) => void;
}

export default function ProfileForm({
  fullName,
  setFullName,
  email,
  bio,
  setBio,
  education,
  setEducation,
  isUsernameEditable,
  username,
  setUsername,
}: ProfileFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={!isUsernameEditable}
          required
        />
        {!isUsernameEditable && (
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            Username cannot be changed after initial setup.
          </p>
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
        <Input id="email" type="email" value={email} disabled />
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
    </div>
  );
}
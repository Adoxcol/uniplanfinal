'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Link from "next/link";
import ProfileSection from '@/components/profile/ProfileSection';

interface Profile {
  id: string;
  username: string;
  full_name: string;
  bio?: string;
  education?: string;
  skills?: string | string[];
  projects?: Array<{ title: string; description: string }> | null;
  avatar_url?: string;
  email: string;
  public_email?: boolean; // Add public_email field
}

export default function ProfilePage() {
  const supabase = createClientComponentClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          // Ensure projects is an array or null
          const processedData = {
            ...data,
            projects: Array.isArray(data.projects) ? data.projects : null
          };
          setProfile(processedData);
          setUsername(data.username);
          setEmail(data.email);
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, [supabase]);

  const handleSave = async () => {
    if (!profile) return;

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: profile.id,
        username: username,
        full_name: profile.full_name,
        email: email,
        public_email: profile.public_email, // Save public_email preference
      });

    if (error) {
      console.error('Error saving profile:', error);
    } else {
      alert('Profile updated successfully!');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-4">Your profile does not exist. Please create one.</p>
          <Link href="/profile/edit">
            <Button>Create Profile</Button>
          </Link>
        </div>
      </div>
    );
  }

  const skillsArray = typeof profile.skills === 'string' 
    ? profile.skills.split(',').map(skill => skill.trim()) 
    : Array.isArray(profile.skills) 
      ? profile.skills 
      : [];

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <main className="container w-full mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="relative h-48 bg-blue-600">
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
          <div className="relative px-6 py-4 flex flex-col sm:flex-row items-center sm:items-end -mt-20 sm:-mt-16 mb-4 sm:mb-0">
            <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
              <AvatarImage src={profile.avatar_url || "/placeholder.svg?height=128&width=128"} alt="Profile picture" />
              <AvatarFallback>{profile.full_name?.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">{profile.full_name}</h1>
              <p className="text-gray-600">Computer Science Student</p>
              {profile.public_email && <p className="text-gray-600">Email: {email}</p>} {/* Conditionally display email */}
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-auto">
              <Link href="/profile/edit">
                <Button variant="outline">Edit Profile</Button>
              </Link>
            </div>
          </div>
          <div className="px-6 py-4">
            <ProfileSection title="About Me">
              <p className="text-gray-600">{profile.bio || 'No information provided.'}</p>
            </ProfileSection>
            <ProfileSection title="Education">
              <p className="text-gray-600">{profile.education || 'No information provided.'}</p>
            </ProfileSection>
            <ProfileSection title="Skills">
              <ul className="list-disc list-inside text-gray-600">
                {skillsArray.length > 0 ? (
                  skillsArray.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))
                ) : (
                  <li>No skills listed.</li>
                )}
              </ul>
            </ProfileSection>
            <ProfileSection title="Projects">
              <ul className="space-y-2">
                {profile.projects && profile.projects.length > 0 ? (
                  profile.projects.map((project, index) => (
                    <li key={index}>
                      <h3 className="font-semibold text-gray-800">{project.title}</h3>
                      <p className="text-gray-600">{project.description}</p>
                    </li>
                  ))
                ) : (
                  <li>No projects listed.</li>
                )}
              </ul>
            </ProfileSection>
          </div>
          <div className="px-6 py-4 flex justify-end">
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
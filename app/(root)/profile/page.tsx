'use client';

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useProfile } from '@/context/ProfileContext'; // Import the profile context

export default function ProfilePage() {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br w-full from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Card className="p-6 sm:p-8 shadow-lg mb-8">
            <div className="animate-pulse space-y-6">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br w-full from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Card className="p-6 sm:p-8 shadow-lg mb-8">
            <div className="text-center text-red-500">Error loading profile data</div>
          </Card>
        </div>
      </div>
    );
  }

  const skills = Array.isArray(profile.skills) ? profile.skills : [];
  const projects = Array.isArray(profile.projects) ? profile.projects : [];

  return (
    <div className="min-h-screen bg-gradient-to-br w-full from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 sm:p-8 shadow-lg animate-fade-in mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
              <AvatarImage 
                src={profile.avatar_url || "/placeholder.svg"} 
                alt={profile.full_name} 
              />
              <AvatarFallback>
                {profile.full_name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{profile.full_name}</h1>
                <p className="text-muted-foreground mt-2">{profile.bio}</p>
              </div>

              <div>
                <h2 className="font-semibold mb-2">Education</h2>
                <div className="space-y-1">
                  {profile.education
                    ?.split("\n")
                    .map((edu, index) => (
                      <p key={index} className="text-muted-foreground">
                        {edu}
                      </p>
                    ))}
                </div>
              </div>

              <div>
                <h2 className="font-semibold mb-2">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.length > 0 ? (
                    skills.map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="hover:scale-105 transition-transform"
                      >
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No skills added yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Link href="/edit-profile">
              <Button className="hover:scale-105 transition-transform duration-200">
                Edit Profile
              </Button>
            </Link>
          </div>
        </Card>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length > 0 ? (
              projects.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title || "Project Image"}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                    <p className="text-muted-foreground">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags?.map((tag, index) => (
                        <Badge key={index} variant="outline" className="hover:bg-accent">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground col-span-full text-center py-8">No projects added yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
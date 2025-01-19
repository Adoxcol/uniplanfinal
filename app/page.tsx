import { Button } from '@/components/ui/button';
import { GraduationCap, BookOpen, Users, Newspaper } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center h-full w-full">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Plan Your Academic Journey with UniPlan
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Create customized degree plans, connect with fellow students, and stay updated with the latest academic news.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/plans">Start Planning</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/forums">Join Community</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-4 md:grid-cols-2">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="p-4 bg-primary/5 rounded-full">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Degree Planner</h3>
              <p className="text-muted-foreground">
                Build and customize your semester-wise degree plans with ease.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="p-4 bg-primary/5 rounded-full">
                <Newspaper className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Blog & News</h3>
              <p className="text-muted-foreground">
                Stay updated with university news and student experiences.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="p-4 bg-primary/5 rounded-full">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Community</h3>
              <p className="text-muted-foreground">
                Connect with peers and share knowledge through forums.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="p-4 bg-primary/5 rounded-full">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Templates</h3>
              <p className="text-muted-foreground">
                Access and share degree plan templates with the community.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
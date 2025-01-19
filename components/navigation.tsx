'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { User } from '@supabase/supabase-js';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Degree Plan', href: '/plans' },
  { name: 'Blogs', href: '/blog' },
  { name: 'Templates', href: '/templates' },
  { name: 'Forums', href: '/forums' },
];

export function Navigation() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch the current user session (only if signed in)
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          // If no session exists, set user to null
          setUser(null);
        } else {
          setUser(user);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        setUser(null); // Fallback to no user
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    // Listen for auth state changes (e.g., sign-in, sign-out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase]);

  if (loading) {
    return <div>Loading...</div>; // Show loading until user state is determined
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-14 items-center px-4 sm:px-6 lg:px-8">
        {/* Logo and Branding */}
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <GraduationCap className="h-6 w-6" />
            <span className="font-bold text-lg">UniPlan</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname === item.href ? 'text-foreground' : 'text-foreground/60'
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          {user ? (
            <ProfileDropdown user={user} signOut={() => supabase.auth.signOut()} />
          ) : (
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => (window.location.href = '/login')}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

function ProfileDropdown({ user, signOut }: { user: User | null; signOut: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user?.user_metadata?.avatar_url || '/default-avatar.jpg'} alt="User Avatar" />
          <AvatarFallback>{user?.email?.charAt(0)?.toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => (window.location.href = '/profile')}>Profile</DropdownMenuItem>
        <DropdownMenuItem onClick={() => (window.location.href = '/settings')}>Settings</DropdownMenuItem>
        <DropdownMenuItem onClick={signOut}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
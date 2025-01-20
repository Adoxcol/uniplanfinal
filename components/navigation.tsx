'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { cn } from '@/lib/utils';
import { useEffect, useState, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { User } from '@supabase/supabase-js';

// Initialize Supabase client outside component
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Degree Plan', href: '/plans' },
  { name: 'Blogs', href: '/blog' },
  { name: 'Templates', href: '/templates' },
  { name: 'Forums', href: '/forums' },
];

const LOADING_TIMEOUT = 3000; // 3 seconds timeout

interface UserProfile {
  id: string;
  avatar_url: string;
  full_name: string;
  username: string;
}

export function Navigation() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, []);

  // Fetch user profile data including avatar
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, avatar_url, full_name, username')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return profile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isSubscribed = true;

    const fetchSession = async () => {
      try {
        timeoutId = setTimeout(() => {
          if (isSubscribed && loading) {
            setLoading(false);
            setError('Loading timeout - please refresh the page');
          }
        }, LOADING_TIMEOUT);

        const { data: { user }, error: sessionError } = await supabase.auth.getUser();
        
        if (isSubscribed) {
          if (sessionError) {
            setUser(null);
            setError(sessionError.message);
          } else {
            setUser(user);
            if (user) {
              const profile = await fetchUserProfile(user.id);
              if (profile) {
                setUserProfile(profile);
              }
            }
            setError(null);
          }
        }
      } catch (error) {
        if (isSubscribed) {
          console.error('Error fetching session:', error);
          setUser(null);
          setError('Failed to load user data');
        }
      } finally {
        if (isSubscribed) {
          clearTimeout(timeoutId);
          setLoading(false);
        }
      }
    };

    // Initialize auth state
    fetchSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (isSubscribed) {
        const newUser = session?.user ?? null;
        setUser(newUser);
        
        if (newUser) {
          const profile = await fetchUserProfile(newUser.id);
          if (profile) {
            setUserProfile(profile);
          }
        } else {
          setUserProfile(null);
        }
      }
    });

    return () => {
      isSubscribed = false;
      clearTimeout(timeoutId);
      subscription?.unsubscribe();
    };
  }, [fetchUserProfile]);

  // Show minimal loading state
  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95">
        <div className="max-w-7xl mx-auto flex h-14 items-center px-4">
          <GraduationCap className="h-6 w-6 animate-pulse" />
        </div>
      </header>
    );
  }

  // Show error state
  if (error) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95">
        <div className="max-w-7xl mx-auto flex h-14 items-center px-4 justify-between">
          <div className="flex items-center">
            <GraduationCap className="h-6 w-6" />
            <span className="ml-2 text-sm text-red-500">{error}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </header>
    );
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
        <nav className="hidden sm:flex items-center space-x-6 text-sm font-medium">
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
            <ProfileDropdown user={user} userProfile={userProfile} signOut={handleSignOut} />
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

function ProfileDropdown({ 
  user, 
  userProfile, 
  signOut 
}: { 
  user: User | null; 
  userProfile: UserProfile | null;
  signOut: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage 
            src={userProfile?.avatar_url || '/default-avatar.jpg'} 
            alt={userProfile?.full_name || 'User Avatar'}
          />
          <AvatarFallback>
            {userProfile?.full_name?.[0]?.toUpperCase() || 
             user?.email?.[0]?.toUpperCase() || 
             'U'}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          className="flex flex-col items-start"
          onClick={() => (window.location.href = '/profile')}
        >
          <span className="font-medium">
            {userProfile?.full_name || 'Your Profile'}
          </span>
          <span className="text-sm text-muted-foreground">
            {userProfile?.username || user?.email}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => (window.location.href = '/profile')}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => (window.location.href = '/settings')}>
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={signOut}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
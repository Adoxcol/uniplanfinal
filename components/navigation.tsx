'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Degree Planner', href: '/plans' },
  { name: 'Templates', href: '/templates' },
  { name: 'Blog', href: '/blog' },
  { name: 'Forums', href: '/forums' },
];

export function Navigation() {
  const pathname = usePathname();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };

    fetchUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

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
            <ProfileDropdown user={user} supabase={supabase} />
          ) : (
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => window.location.href = '/login'}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

function ProfileDropdown({ user, supabase }) {
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
        <DropdownMenuItem onClick={async () => await supabase.auth.signOut()}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

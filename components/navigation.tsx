'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';
import { ModeToggle } from './mode-toggle';


const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Degree Planner', href: '/plans' },
  { name: 'Templates', href: '/templates' },
  { name: 'Blog', href: '/blog' },
  
  { name: 'Forums', href: '/forums' },

];

export function Navigation() {
  const pathname = usePathname();

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
          <Button asChild variant="default" size="sm">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

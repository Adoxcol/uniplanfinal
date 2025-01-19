"use client"; // Mark as a client component

import { usePathname } from 'next/navigation';
import BackButton from '@/components/BackButton'; // Import the BackButton component

export default function BackButtonWrapper() {
  const pathname = usePathname(); // Get the current route
  const isHomepage = pathname === '/'; // Check if the current route is the homepage

  // Only render the BackButton if not on the homepage
  return !isHomepage ? <BackButton /> : null;
}
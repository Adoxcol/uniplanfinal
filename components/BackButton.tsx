"use client"; // Mark as a client component

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react'; // Import an icon for the button

export default function BackButton() {
  const router = useRouter();

  // Handle back navigation with fallback
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back(); // Go back if there is history
    } else {
      router.push('/'); // Fallback to the homepage
    }
  };

  return (
    <div className="container mx-auto px-4 py-2">
      <Button
        variant="ghost"
        onClick={handleBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> {/* Icon */}
        Back
      </Button>
    </div>
  );
}
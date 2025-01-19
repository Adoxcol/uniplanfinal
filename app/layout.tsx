import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Navigation } from '@/components/navigation';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from 'next-themes';
import BackButtonWrapper from '@/components/BackButtonWrapper'; // Import the wrapper

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'UniPlan - Your Academic Journey Planner',
  description: 'Plan your academic journey with our comprehensive degree planning platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} h-screen w-screen`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col h-full w-full">
            {/* Navigation bar */}
            <Navigation />

            {/* Back Button (Conditional) */}
            <BackButtonWrapper />

            {/* Main content */}
            <main className="flex-1 flex items-center justify-center">
              {children}
            </main>

            {/* Toaster notifications */}
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
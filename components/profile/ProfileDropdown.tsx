"use client";

import { LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";

export function ProfileDropdown() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  };

  return (
    <Popover>
      <PopoverTrigger className={buttonVariants({
        variant: "ghost",
        size: "icon",
      })}>
        <User className="h-5 w-5" />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 p-2">
        <div className="grid gap-1">
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => router.push("/profile")}
          >
            <User className="mr-2 h-4 w-4" />
            <span>View Profile</span>
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => router.push("/settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
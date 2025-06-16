"use client";

import { Menu, UserCircle, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

interface HeaderProps {
  onToggleSidebar: () => void;
}

interface UserToken {
  name?: string;
  email?: string;
  image?: string;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user as UserToken | undefined;

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <header className="flex h-[95px] items-center justify-between border-b border-gray-200 bg-brand-white px-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <h1 className="text-xl font-semibold text-brand-text-dark ml-2 md:ml-0">
          Dashboard
        </h1>
      </div>

      <div className="flex items-center cursor-pointer">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={token?.image || "/placeholder.svg?height=40&width=40"}
                    alt="User avatar"
                  />
                  <AvatarFallback>
                    <UserCircle className="h-8 w-8 text-black" />
                  </AvatarFallback>
                </Avatar>
              </Button>
              <div className="flex flex-col space-y-1 text-left">
                <p className="text-[16px] text-[#000000] font-medium leading-[120%]">
                  {token?.name || "Admin Name"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {token?.email || "admin@example.com"}
                </p>
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {token?.name || "Admin Name"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {token?.email || "admin@example.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

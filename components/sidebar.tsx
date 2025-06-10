"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
// import {
//   Home,
//   ShoppingBag,
//   ListOrdered,
//   Users,
//   Settings,
//   LogOut,
//   ListChecks,
// } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import sidebarImage from "../public/images/sidebarImage.png";

const navigation = [
  { name: "Overview", href: "/dashboard" },
  { name: "Products", href: "/dashboard/products" },
  { name: "Categories", href: "/dashboard/categories" },
  { name: "Orders", href: "/dashboard/orders" },
  { name: "Customers", href: "/dashboard/customers" },
  { name: "Promo Codes", href: "/dashboard/promocodes" },
  { name: "Settings", href: "/dashboard/settings" },
];

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    setLoading(true);
    signOut();
    router.push("/login");
  };

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  return (
    <>
      <div
        className={cn(
          "flex flex-col bg-brand-pink/10 text-brand-text-dark transition-all duration-300 ease-in-out",
          isOpen ? "w-[330px]" : "w-20"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-center h-[95px] my-[40px]",
            isOpen ? "px-6" : "px-2"
          )}
        >
          {isOpen ? (
            <Logo />
          ) : (
            <Image
              src={sidebarImage}
              alt="Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
          )}
        </div>
        <nav className="flex-1 space-y-1 px-6 py-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-md px-5 py-4 text-base font-bold hover:bg-brand-pink/20 hover:text-brand-black",
                pathname === item.href ||
                  (pathname.startsWith(item.href) && item.href !== "/dashboard")
                  ? "bg-brand-black text-brand-white"
                  : "text-brand-text-dark",
                !isOpen && "justify-center"
              )}
              title={item.name}
            >
              {/* <item.icon
              className={cn("h-6 w-6 shrink-0", isOpen ? "mr-3" : "mr-0")}
              aria-hidden="true"
            /> */}
              {isOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
        <div className="mt-auto p-2">
          <Button
            variant="ghost"
            onClick={() => setOpen(true)}
            className={cn(
              "w-full flex items-center rounded-md px-2 py-2 text-sm font-medium text-brand-text-dark hover:bg-brand-pink/20 hover:text-brand-black border border-[#BFBFBF]",
              !isOpen && "justify-between"
            )}
            title="Logout"
          >
            <LogOut
              className={cn("h-6 w-6 shrink-0", isOpen ? "mr-3" : "mr-0")}
              aria-hidden="true"
            />
            {isOpen && <span>Logout</span>}
          </Button>
        </div>
      </div>
      <AlertModal
        title="Are you sure want to logout?"
        message=""
        loading={loading}
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}

// Need to add Image import for the collapsed logo
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import AlertModal from "./ui/alert-modal";

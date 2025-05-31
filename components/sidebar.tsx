"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, ShoppingBag, ListOrdered, Users, Settings, LogOut, ListChecks } from "lucide-react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

const navigation = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Products", href: "/dashboard/products", icon: ShoppingBag },
  { name: "Categories", href: "/dashboard/categories", icon: ListChecks },
  { name: "Orders", href: "/dashboard/orders", icon: ListOrdered },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

interface SidebarProps {
  isOpen: boolean
}

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    router.push("/login")
  }

  return (
    <div
      className={cn(
        "flex flex-col bg-brand-pink/10 text-brand-text-dark transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-20",
      )}
    >
      <div
        className={cn("flex items-center justify-center h-20 border-b border-brand-pink/20", isOpen ? "px-6" : "px-2")}
      >
        {isOpen ? <Logo /> : <Image src="/logo.png" alt="Logo" width={32} height={32} className="h-8 w-8" />}
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "group flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-brand-pink/20 hover:text-brand-black",
              pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard")
                ? "bg-brand-black text-brand-white"
                : "text-brand-text-dark",
              !isOpen && "justify-center",
            )}
            title={item.name}
          >
            <item.icon className={cn("h-6 w-6 shrink-0", isOpen ? "mr-3" : "mr-0")} aria-hidden="true" />
            {isOpen && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>
      <div className="mt-auto border-t border-brand-pink/20 p-2">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center rounded-md px-2 py-2 text-sm font-medium text-brand-text-dark hover:bg-brand-pink/20 hover:text-brand-black",
            !isOpen && "justify-center",
          )}
          title="Logout"
        >
          <LogOut className={cn("h-6 w-6 shrink-0", isOpen ? "mr-3" : "mr-0")} aria-hidden="true" />
          {isOpen && <span>Logout</span>}
        </Button>
      </div>
    </div>
  )
}

// Need to add Image import for the collapsed logo
import Image from "next/image"

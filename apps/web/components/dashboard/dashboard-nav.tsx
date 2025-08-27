"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Users,
  Scissors,
  BarChart3,
  Settings,
  Mail,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Appointments", href: "/dashboard/appointments", icon: Calendar },
  { name: "Clients", href: "/dashboard/clients", icon: Users },
  { name: "Services", href: "/dashboard/services", icon: Scissors },
  { name: "Marketing", href: "/dashboard/marketing", icon: Mail },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-primary">
                SalonX
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {session?.user?.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>

          <div className="sm:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
                    isActive
                      ? "bg-primary/10 border-primary text-primary"
                      : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="text-base font-medium text-gray-800">
                {session?.user?.email}
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => signOut()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

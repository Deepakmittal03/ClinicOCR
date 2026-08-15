"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Upload, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Patients",
    icon: Users,
    href: "/patients",
  },
  {
    label: "Upload Prescription",
    icon: Upload,
    href: "/upload",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#f8fafc] border-r">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14 space-x-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Clinic<span className="text-blue-600">OCR</span>
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded-lg transition",
                pathname.startsWith(route.href) ? "text-blue-600 bg-blue-50" : "text-gray-500",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", pathname.startsWith(route.href) ? "text-blue-600" : "text-gray-400")} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

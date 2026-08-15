"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden p-2 text-gray-500 hover:text-gray-700">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}

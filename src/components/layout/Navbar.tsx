import { MobileSidebar } from "./MobileSidebar";
import { UserCircle } from "lucide-react";

export function Navbar() {
  return (
    <div className="flex items-center p-4 bg-white shadow-sm h-16">
      <MobileSidebar />
      <div className="flex w-full justify-end">
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
          <UserCircle className="h-6 w-6" />
          <span>Dr. Smith</span>
        </div>
      </div>
    </div>
  );
}


import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export const SidebarLogo = () => {
  return (
    <div className="flex h-16 shrink-0 items-center justify-center border-b border-sidebar-border p-2 bg-sidebar-accent/30">
      <Link to="/" className="flex items-center justify-center md:justify-start gap-2 outline-none">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary shadow-md">
          <BookOpen className="h-6 w-6 text-sidebar-primary-foreground" />
        </div>
        <div className="hidden md:flex flex-col items-start whitespace-nowrap overflow-hidden transition-all duration-300">
          <span className="font-semibold text-sidebar-foreground">MTEFOP</span>
          <span className="text-xs text-sidebar-foreground/60">Formation Pro</span>
        </div>
      </Link>
    </div>
  );
};

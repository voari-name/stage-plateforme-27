
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Users,
  Star,
  Info,
  UserCircle
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Banner } from "@/components/layout/Banner";

type NavItemProps = {
  icon: React.ElementType;
  label: string;
  to: string;
  expanded: boolean;
  active?: boolean;
};

const NavItem = ({ icon: Icon, label, to, expanded, active }: NavItemProps) => {
  if (expanded) {
    return (
      <Link to={to} className="w-full block mb-1">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start transition-all duration-200 sidebar-item-hover",
            active ? "sidebar-item-active" : ""
          )}
        >
          <Icon className={cn("h-5 w-5 mr-2", active ? "text-blue-600 dark:text-blue-400" : "")} />
          <span className="font-medium">{label}</span>
        </Button>
      </Link>
    );
  } else {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to={to} className="w-full block mb-1">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-center py-3 transition-all duration-200 sidebar-item-hover",
                  active ? "sidebar-item-active" : ""
                )}
              >
                <Icon className={cn("h-5 w-5", active ? "text-blue-600 dark:text-blue-400" : "")} />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-popover font-medium">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
};

export function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div
      className={cn(
        "h-screen flex flex-col bg-gradient-to-b from-blue-50 via-indigo-50 to-blue-50 dark:from-blue-950 dark:via-indigo-950 dark:to-blue-950 border-r border-sidebar-border transition-all duration-300 shadow-lg",
        expanded ? "w-64" : "w-16"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-900 dark:to-indigo-900">
        {expanded && (
          <div className="flex items-center fade-in">
            <img 
              src="/lovable-uploads/5c0ae490-98de-4bfa-bff1-df9fe97ebe0b.png" 
              alt="MTEFoP Logo" 
              className="h-10 w-10 mr-2 animate-pulse"
            />
            <h1 className="text-xl font-bold text-blue-700 dark:text-blue-300">MTEFoP</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full",
            expanded ? "ml-auto" : "mx-auto"
          )}
        >
          {expanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          )}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
      
      <div className="flex-1 px-3 py-4 space-y-2 overflow-y-auto scrollbar-hide">
        <NavItem
          icon={Info}
          label="À propos"
          to="/a-propos"
          expanded={expanded}
          active={isActive("/a-propos")}
        />
        <NavItem
          icon={Users}
          label="Stagiaires"
          to="/stagiaires"
          expanded={expanded}
          active={isActive("/stagiaires")}
        />
        <NavItem
          icon={Star}
          label="Évaluations"
          to="/evaluations"
          expanded={expanded}
          active={isActive("/evaluations")}
        />
        <NavItem
          icon={UserCircle}
          label="Profil"
          to="/profil"
          expanded={expanded}
          active={isActive("/profil")}
        />
      </div>

      <div className="mt-auto p-3">
        <Banner className={cn(
          "w-full rounded-lg overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1", 
          !expanded && "h-24"
        )} />
      </div>
    </div>
  );
}

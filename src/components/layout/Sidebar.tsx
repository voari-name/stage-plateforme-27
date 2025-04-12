
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  Users,
  ClipboardList,
  Star,
  BarChart3,
  Info,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
          <Icon className={cn("h-5 w-5 mr-2", active ? "text-primary" : "")} />
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
                <Icon className={cn("h-5 w-5", active ? "text-primary" : "")} />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-popover">
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
        "h-screen bg-sidebar flex flex-col border-r border-sidebar-border transition-all duration-300 shadow-sm",
        expanded ? "w-64" : "w-16"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {expanded && (
          <div className="flex items-center fade-in">
            <img 
              src="/lovable-uploads/5c0ae490-98de-4bfa-bff1-df9fe97ebe0b.png" 
              alt="MTEFoP Logo" 
              className="h-10 w-10 mr-2"
            />
            <h1 className="text-xl font-bold text-blue-500">MTEFoP</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setExpanded(!expanded)}
          className="ml-auto hover:bg-blue-50"
        >
          {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
      
      <div className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto scrollbar-hide">
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
          icon={ClipboardList}
          label="Missions"
          to="/missions"
          expanded={expanded}
          active={isActive("/missions")}
        />
        <NavItem
          icon={BarChart3}
          label="Rapports"
          to="/rapports"
          expanded={expanded}
          active={isActive("/rapports")}
        />
        <NavItem
          icon={Home}
          label="Tableau de bord"
          to="/"
          expanded={expanded}
          active={isActive("/")}
        />
      </div>
      
      <div className="p-3 border-t border-sidebar-border">
        <NavItem
          icon={Settings}
          label="Paramètres"
          to="/parametres"
          expanded={expanded}
          active={isActive("/parametres")}
        />
      </div>
    </div>
  );
}

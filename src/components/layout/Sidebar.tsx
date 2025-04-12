
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  ChevronLeft,
  ClipboardList,
  Home,
  Settings,
  Star,
  Users
} from "lucide-react";

type NavItemProps = {
  icon: React.ElementType;
  label: string;
  to: string;
  expanded: boolean;
  active?: boolean;
};

const NavItem = ({ icon: Icon, label, to, expanded, active }: NavItemProps) => {
  return (
    <Link to={to}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start mb-1",
          active ? "bg-sidebar-accent text-sidebar-primary" : ""
        )}
      >
        <Icon className={cn("h-5 w-5", active ? "text-sidebar-primary" : "")} />
        {expanded && <span className="ml-2">{label}</span>}
      </Button>
    </Link>
  );
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
        "h-screen bg-sidebar flex flex-col border-r border-sidebar-border transition-all duration-300",
        expanded ? "w-64" : "w-16"
      )}
    >
      <div className="flex items-center justify-between p-4">
        {expanded && (
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/5c0ae490-98de-4bfa-bff1-df9fe97ebe0b.png" 
              alt="MTEFoP Logo" 
              className="h-10 w-10 mr-2"
            />
            <h1 className="text-xl font-bold text-sidebar-primary">MTEFoP</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setExpanded(!expanded)}
          className="ml-auto"
        >
          <ChevronLeft className={cn("h-5 w-5 transition-all", !expanded && "rotate-180")} />
        </Button>
      </div>
      
      <div className="flex-1 px-3 py-2">
        <NavItem
          icon={Home}
          label="Tableau de bord"
          to="/"
          expanded={expanded}
          active={isActive("/")}
        />
        <NavItem
          icon={Users}
          label="Stagiaires"
          to="/stagiaires"
          expanded={expanded}
          active={isActive("/stagiaires")}
        />
        <NavItem
          icon={ClipboardList}
          label="Missions"
          to="/missions"
          expanded={expanded}
          active={isActive("/missions")}
        />
        <NavItem
          icon={Star}
          label="Évaluations"
          to="/evaluations"
          expanded={expanded}
          active={isActive("/evaluations")}
        />
        <NavItem
          icon={BarChart3}
          label="Rapports"
          to="/rapports"
          expanded={expanded}
          active={isActive("/rapports")}
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

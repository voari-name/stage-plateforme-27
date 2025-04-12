
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
  Settings
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
          active ? "bg-sidebar-accent text-primary" : ""
        )}
      >
        <Icon className={cn("h-5 w-5", active ? "text-primary" : "")} />
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
            <h1 className="text-xl font-bold text-blue-500">MTEFoP</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setExpanded(!expanded)}
          className="ml-auto"
        >
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
      
      <div className="flex-1 px-3 py-2 space-y-1">
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
        <NavItem
          icon={Info}
          label="À propos"
          to="/a-propos"
          expanded={expanded}
          active={isActive("/a-propos")}
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

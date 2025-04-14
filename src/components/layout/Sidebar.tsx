
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  User,
  Users,
  Star,
  Info,
  Settings,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  LogOut,
  Mail,
  Phone
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

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
          <Icon className={cn("h-5 w-5 mr-2", active ? "text-blue-600" : "")} />
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
                <Icon className={cn("h-5 w-5", active ? "text-blue-600" : "")} />
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
  const { toast } = useToast();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès."
    });
    // La redirection se fera par le router dans App.tsx
    window.location.href = "/login";
  };

  return (
    <div
      className={cn(
        "h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-blue-50 flex flex-col border-r border-sidebar-border transition-all duration-300 shadow-lg",
        expanded ? "w-64" : "w-16"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border bg-gradient-to-r from-blue-200 to-indigo-200">
        {expanded && (
          <div className="flex items-center fade-in">
            <img 
              src="/lovable-uploads/5c0ae490-98de-4bfa-bff1-df9fe97ebe0b.png" 
              alt="MTEFoP Logo" 
              className="h-10 w-10 mr-2 animate-pulse"
            />
            <h1 className="text-xl font-bold text-blue-700">MTEFoP</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setExpanded(!expanded)}
          className="ml-auto hover:bg-blue-100 rounded-full"
        >
          {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
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
      </div>
      
      <div className="mt-auto">
        <div className="p-3 mx-2 mb-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md">
          {expanded ? (
            <div className="flex flex-col items-center p-2 space-y-2 animate-fade-in">
              <h3 className="font-bold">Besoin d'aide ?</h3>
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-1" />
                <span>support@mtefop.mg</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-1" />
                <span>+261 20 22 651 31</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <Mail className="h-6 w-6" />
            </div>
          )}
        </div>
        
        <div className="p-3 border-t border-sidebar-border bg-gradient-to-r from-blue-200 to-indigo-200">
          <NavItem
            icon={UserCircle}
            label="Profil"
            to="/profil"
            expanded={expanded}
            active={isActive("/profil")}
          />
          <NavItem
            icon={Settings}
            label="Paramètres"
            to="/parametres"
            expanded={expanded}
            active={isActive("/parametres")}
          />
          
          {expanded ? (
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 mt-1"
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span className="font-medium">Déconnexion</span>
            </Button>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-center py-3 text-red-600 hover:text-red-700 hover:bg-red-50 mt-1"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-popover font-medium">
                  Déconnexion
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
}


import { useLocation } from "react-router-dom";
import { 
  Info, 
  Users, 
  ClipboardCheck, 
  Layers, 
  Briefcase, 
  UserCircle, 
  Settings 
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useTranslation } from "@/lib/translations";
import { Separator } from "@/components/ui/separator";
import { SidebarSection } from "./sidebar/SidebarSection";
import { SidebarLogo } from "./sidebar/SidebarLogo";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { SidebarItemProps } from "./sidebar/types";

export function Sidebar() {
  const location = useLocation();
  const { language } = useTheme();
  const { t } = useTranslation(language);

  // Define menu sections
  const mainMenuItems: SidebarItemProps[] = [
    {
      name: t("sidebar.about"),
      href: "/a-propos",
      icon: Info,
      current: location.pathname === "/a-propos",
    },
    {
      name: t("sidebar.stagiaires"),
      href: "/stagiaires",
      icon: Users,
      current: location.pathname === "/stagiaires",
    },
    {
      name: t("sidebar.evaluations"),
      href: "/evaluations",
      icon: ClipboardCheck,
      current: location.pathname === "/evaluations",
    },
  ];
  
  const projectsMenuItems: SidebarItemProps[] = [
    {
      name: t("sidebar.projects"),
      href: "/gestion-projets",
      icon: Layers,
      current: location.pathname === "/gestion-projets",
    },
    {
      name: t("sidebar.missions"),
      href: "/missions",
      icon: Briefcase,
      current: location.pathname === "/missions",
    },
  ];
  
  const accountMenuItems: SidebarItemProps[] = [
    {
      name: t("sidebar.profile"),
      href: "/profil",
      icon: UserCircle,
      current: location.pathname === "/profil",
    },
    {
      name: t("sidebar.settings"),
      href: "/parametres",
      icon: Settings,
      current: location.pathname === "/parametres",
    },
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-16 bg-sidebar pb-10 transition-all duration-300 ease-in-out hover:w-56 md:w-56 flex flex-col overflow-hidden border-r border-sidebar-border shadow-lg">
      <SidebarLogo />
      <nav className="flex-1 overflow-hidden hover:overflow-y-auto scrollbar-hide">
        <div className="flex flex-col gap-4 py-4">
          {/* Main Navigation Section */}
          <SidebarSection title="main" items={mainMenuItems} language={language} />
          
          <Separator className="mx-2 bg-sidebar-border/50" />
          
          {/* Projects Section */}
          <SidebarSection title="projects" items={projectsMenuItems} language={language} />
          
          <Separator className="mx-2 bg-sidebar-border/50" />
          
          {/* Account Section */}
          <SidebarSection title="account" items={accountMenuItems} language={language} />
        </div>
      </nav>
      <SidebarFooter />
    </div>
  );
}

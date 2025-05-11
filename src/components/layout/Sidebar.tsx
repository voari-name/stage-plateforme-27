
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ChartBarIcon,
  HomeIcon,
  UsersIcon,
  ClipboardDocumentCheckIcon,
  BookOpenIcon,
  BriefcaseIcon,
  Cog6ToothIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "@/components/ThemeProvider";
import { useTranslation } from "@/lib/translations";

export function Sidebar() {
  const location = useLocation();
  const { language } = useTheme();
  const { t } = useTranslation(language);

  const menuItems = [
    {
      name: t("sidebar.about"),
      href: "/a-propos",
      icon: HomeIcon,
      current: location.pathname === "/a-propos",
    },
    {
      name: t("sidebar.stagiaires"),
      href: "/stagiaires",
      icon: UsersIcon,
      current: location.pathname === "/stagiaires",
    },
    {
      name: t("sidebar.evaluations"),
      href: "/evaluations",
      icon: ClipboardDocumentCheckIcon,
      current: location.pathname === "/evaluations",
    },
    {
      name: t("sidebar.projects"),
      href: "/gestion-projets",
      icon: ChartBarIcon,
      current: location.pathname === "/gestion-projets",
    },
    {
      name: t("sidebar.missions"),
      href: "/missions",
      icon: BriefcaseIcon,
      current: location.pathname === "/missions",
    },
    {
      name: "Profil",
      href: "/profil",
      icon: UserCircleIcon,
      current: location.pathname === "/profil",
    },
    {
      name: t("sidebar.settings"),
      href: "/parametres",
      icon: Cog6ToothIcon,
      current: location.pathname === "/parametres",
    },
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-16 bg-sidebar pb-10 transition-all duration-300 ease-in-out hover:w-56 md:w-56 flex flex-col overflow-hidden border-r border-sidebar-border shadow-sm">
      <div className="flex h-16 shrink-0 items-center justify-center border-b border-sidebar-border p-2">
        <Link to="/" className="flex items-center justify-center md:justify-start gap-2 outline-none">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
            <BookOpenIcon className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          <div className="hidden md:flex flex-col items-start whitespace-nowrap overflow-hidden transition-all duration-300">
            <span className="font-semibold text-sidebar-foreground">MTEFOP</span>
            <span className="text-xs text-sidebar-foreground/60">Formation Pro</span>
          </div>
        </Link>
      </div>
      <nav className="flex-1 overflow-hidden hover:overflow-y-auto scrollbar-hide">
        <ul className="flex flex-col gap-1 p-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={cn(
                  "group flex h-10 w-full items-center rounded-md px-3 outline-none hover:bg-sidebar-accent",
                  item.current && "bg-sidebar-accent font-medium"
                )}
              >
                <item.icon
                  className={cn("h-5 w-5 text-sidebar-foreground/60 group-hover:text-sidebar-foreground", 
                    item.current && "text-sidebar-foreground")}
                />
                <span className="ml-3 whitespace-nowrap text-sm text-sidebar-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 md:opacity-100">
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto p-4 hidden md:block">
        <Button
          variant="outline"
          className="w-full justify-start text-xs text-sidebar-foreground/70 bg-sidebar-accent/50 hover:bg-sidebar-accent hover:text-sidebar-foreground border-sidebar-border"
        >
          v1.0.0
        </Button>
      </div>
    </div>
  );
}


import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SidebarItemProps } from "./types";

export const SidebarItem = ({ name, href, icon: Icon, current }: SidebarItemProps) => {
  return (
    <li key={name}>
      <Link
        to={href}
        className={cn(
          "group flex h-10 w-full items-center rounded-md px-3 outline-none hover:bg-sidebar-accent transition-colors duration-200",
          current && "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
        )}
        aria-label={name}
        title={name}
      >
        <Icon
          className={cn(
            "h-5 w-5 text-sidebar-foreground/60 group-hover:text-sidebar-foreground", 
            current && "text-sidebar-primary-foreground"
          )}
        />
        <span className="ml-3 whitespace-nowrap text-sm text-sidebar-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 md:opacity-100">
          {name}
        </span>
      </Link>
    </li>
  );
};

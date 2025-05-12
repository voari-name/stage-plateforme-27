
import { Separator } from "@/components/ui/separator";
import { SidebarSectionProps } from "./types";
import { SidebarItem } from "./SidebarItem";
import { getLanguageLabel } from "./utils";

export const SidebarSection = ({ title, items, language }: SidebarSectionProps) => {
  return (
    <div className="px-2">
      <div className="pl-4 mb-2">
        <span className="text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50 hidden md:inline-block">
          {getLanguageLabel(title, language)}
        </span>
      </div>
      <ul className="flex flex-col gap-1">
        {items.map((item) => (
          <SidebarItem 
            key={item.name} 
            name={item.name} 
            href={item.href} 
            icon={item.icon} 
            current={item.current} 
          />
        ))}
      </ul>
    </div>
  );
};

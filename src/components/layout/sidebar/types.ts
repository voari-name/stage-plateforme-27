
import { LucideIcon } from "lucide-react";

export interface SidebarItemProps {
  name: string;
  href: string;
  icon: LucideIcon;
  current: boolean;
}

export interface SidebarSectionProps {
  title: string; 
  items: SidebarItemProps[];
  language: string;
}

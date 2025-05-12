
import { Button } from "@/components/ui/button";

export const SidebarFooter = () => {
  return (
    <div className="mt-auto p-4 hidden md:block">
      <Button
        variant="outline"
        className="w-full justify-start text-xs text-sidebar-foreground/70 bg-sidebar-accent/50 hover:bg-sidebar-accent hover:text-sidebar-foreground border-sidebar-border"
      >
        v1.0.0
      </Button>
    </div>
  );
};

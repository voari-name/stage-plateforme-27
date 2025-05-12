
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";

interface MissionsEmptyStateProps {
  resetFilters: () => void;
}

export const MissionsEmptyState = ({ resetFilters }: MissionsEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
        <ClipboardList className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="font-medium text-lg mb-1">Aucune mission trouvée</h3>
      <p className="text-muted-foreground mb-4">
        Aucune mission ne correspond à vos filtres.
      </p>
      <Button variant="outline" onClick={resetFilters}>
        Réinitialiser les filtres
      </Button>
    </div>
  );
};

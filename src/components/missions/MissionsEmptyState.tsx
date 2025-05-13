
import { Button } from "@/components/ui/button";
import { FileSearch } from "lucide-react";

interface MissionsEmptyStateProps {
  resetFilters: () => void;
  language: string;
}

export const MissionsEmptyState = ({ resetFilters, language }: MissionsEmptyStateProps) => {
  const getMessage = () => {
    switch(language) {
      case "fr": return "Aucune mission ne correspond à vos critères de recherche.";
      case "en": return "No missions match your search criteria.";
      case "mg": return "Tsy misy iraka mifanaraka amin'ny fikarohana nataonao.";
      default: return "Aucune mission ne correspond à vos critères de recherche.";
    }
  };

  const getButtonText = () => {
    switch(language) {
      case "fr": return "Réinitialiser les filtres";
      case "en": return "Reset filters";
      case "mg": return "Avereno ny sivana";
      default: return "Réinitialiser les filtres";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-muted/50 p-4 rounded-full">
        <FileSearch className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-medium">{getMessage()}</h3>
      <Button 
        variant="outline" 
        onClick={resetFilters}
        className="mt-4"
      >
        {getButtonText()}
      </Button>
    </div>
  );
};


import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface MissionsHeaderProps {
  onCreateMission: () => void;
  language: string;
}

export const MissionsHeader = ({ onCreateMission, language }: MissionsHeaderProps) => {
  const getTitle = () => {
    switch(language) {
      case "fr": return "Gestion des Missions";
      case "en": return "Mission Management";
      case "mg": return "Fitantanana ny Iraka";
      default: return "Gestion des Missions";
    }
  };

  const getDescription = () => {
    switch(language) {
      case "fr": return "Créez et gérez les missions pour vos stagiaires.";
      case "en": return "Create and manage missions for your trainees.";
      case "mg": return "Mamorona sy mitantana ireo iraka ho an'ny mpianatra.";
      default: return "Créez et gérez les missions pour vos stagiaires.";
    }
  };

  const getButtonText = () => {
    switch(language) {
      case "fr": return "Nouvelle Mission";
      case "en": return "New Mission";
      case "mg": return "Iraka Vaovao";
      default: return "Nouvelle Mission";
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold">{getTitle()}</h1>
        <p className="text-muted-foreground mt-1">{getDescription()}</p>
      </div>

      <Button onClick={onCreateMission} className="shrink-0">
        <PlusCircle className="h-4 w-4 mr-2" />
        {getButtonText()}
      </Button>
    </div>
  );
};

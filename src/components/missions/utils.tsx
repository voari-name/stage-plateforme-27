
import { Clock, ClipboardList, Check } from "lucide-react";
import { ReactNode } from "react";

export type MissionStatus = "not_started" | "in_progress" | "completed";

type StatusConfig = {
  label: string; 
  className: string;
  icon: ReactNode;
};

export const getMissionStatusConfig = (status: MissionStatus, language = "fr"): StatusConfig => {
  const getStatusLabel = (status: MissionStatus) => {
    switch(status) {
      case "not_started": 
        return language === "fr" ? "Non commencée" : 
               language === "en" ? "Not started" : 
               "Tsy nanomboka";
      case "in_progress": 
        return language === "fr" ? "En cours" : 
               language === "en" ? "In progress" : 
               "Eo am-panatanterahana";
      case "completed": 
        return language === "fr" ? "Terminée" : 
               language === "en" ? "Completed" : 
               "Vita";
      default: 
        return status;
    }
  };

  const config: Record<MissionStatus, Omit<StatusConfig, 'label'> & { defaultLabel: string }> = {
    not_started: { 
      defaultLabel: "Non commencée", 
      className: "bg-muted text-muted-foreground",
      icon: <Clock className="h-4 w-4 mr-1" />
    },
    in_progress: { 
      defaultLabel: "En cours", 
      className: "bg-info text-info-foreground",
      icon: <ClipboardList className="h-4 w-4 mr-1" />
    },
    completed: { 
      defaultLabel: "Terminée", 
      className: "bg-success text-success-foreground",
      icon: <Check className="h-4 w-4 mr-1" />
    }
  };
  
  return {
    ...config[status],
    label: getStatusLabel(status)
  };
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

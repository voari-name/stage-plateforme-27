
import { Clock, ClipboardList, Check } from "lucide-react";
import { ReactNode } from "react";

export type MissionStatus = "not_started" | "in_progress" | "completed";

type StatusConfig = {
  label: string; 
  className: string;
  icon: ReactNode;
};

export const getMissionStatusConfig = (status: MissionStatus): StatusConfig => {
  const config: Record<MissionStatus, StatusConfig> = {
    not_started: { 
      label: "Non commencée", 
      className: "bg-muted text-muted-foreground",
      icon: <Clock className="h-4 w-4 mr-1" />
    },
    in_progress: { 
      label: "En cours", 
      className: "bg-info text-info-foreground",
      icon: <ClipboardList className="h-4 w-4 mr-1" />
    },
    completed: { 
      label: "Terminée", 
      className: "bg-success text-success-foreground",
      icon: <Check className="h-4 w-4 mr-1" />
    }
  };
  
  return config[status];
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

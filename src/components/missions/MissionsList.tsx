
import { MissionCard, MissionType } from "./MissionCard";

interface MissionsListProps {
  missions: MissionType[];
  onViewDetails: (id: string) => void;
  onAssign: (id: string) => void;
  onDelete: (id: string) => void;
  language: string;
}

export const MissionsList = ({ 
  missions, 
  onViewDetails, 
  onAssign,
  onDelete,
  language
}: MissionsListProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      {missions.map((mission) => (
        <MissionCard 
          key={mission.id} 
          mission={mission} 
          onViewDetails={onViewDetails}
          onAssign={onAssign}
          onDelete={onDelete}
          language={language}
        />
      ))}
    </div>
  );
};

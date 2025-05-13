
import { MissionCard, MissionType } from "./MissionCard";

interface MissionsListProps {
  missions: MissionType[];
  onViewDetails: (id: string) => void;
  onAssign: (id: string) => void;
  language: string;
}

export const MissionsList = ({ 
  missions, 
  onViewDetails, 
  onAssign,
  language
}: MissionsListProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {missions.map((mission) => (
        <MissionCard 
          key={mission.id} 
          mission={mission} 
          onViewDetails={onViewDetails}
          onAssign={onAssign}
          language={language}
        />
      ))}
    </div>
  );
};

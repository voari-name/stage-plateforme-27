
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface MissionsHeaderProps {
  onCreateMission: () => void;
}

export const MissionsHeader = ({ onCreateMission }: MissionsHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">Missions</h1>
      <Button onClick={onCreateMission}>
        <Plus className="h-4 w-4 mr-2" />
        Nouvelle mission
      </Button>
    </div>
  );
};

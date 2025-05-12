
import React from "react";
import { Button } from "@/components/ui/button";

interface MissionFormActionsProps {
  onCancel?: () => void;
  isEdit: boolean;
}

export const MissionFormActions: React.FC<MissionFormActionsProps> = ({ onCancel, isEdit }) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      {onCancel && (
        <Button variant="outline" type="button" onClick={onCancel}>
          Annuler
        </Button>
      )}
      <Button type="submit">
        {isEdit ? "Mettre à jour" : "Créer la mission"}
      </Button>
    </div>
  );
};

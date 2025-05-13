
import React from "react";
import { Button } from "@/components/ui/button";

interface MissionFormActionsProps {
  onCancel: () => void;
  language: string;
}

export const MissionFormActions: React.FC<MissionFormActionsProps> = ({ onCancel, language }) => {
  const getSubmitText = () => {
    return language === "fr" ? "Enregistrer" : 
           language === "en" ? "Save" : 
           "Hitahiry";
  };

  const getCancelText = () => {
    return language === "fr" ? "Annuler" : 
           language === "en" ? "Cancel" : 
           "Hanafoana";
  };

  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" type="button" onClick={onCancel}>
        {getCancelText()}
      </Button>
      <Button type="submit">
        {getSubmitText()}
      </Button>
    </div>
  );
};

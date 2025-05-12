
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MissionType } from "./MissionCard";
import { ScrollArea } from "@/components/ui/scroll-area";

type Stagiaire = {
  id: string;
  nom: string;
  prenom: string;
  avatar?: string;
};

interface AssignStagiairesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mission?: MissionType;
  stagiaires: Stagiaire[];
  onAssign: (missionId: string, stagiaireIds: string[]) => void;
}

export function AssignStagiairesDialog({ 
  open, 
  onOpenChange, 
  mission,
  stagiaires,
  onAssign
}: AssignStagiairesDialogProps) {
  const { toast } = useToast();
  const [selectedStagiaires, setSelectedStagiaires] = useState<string[]>(
    mission?.stagiaires.map(s => s.id) || []
  );
  
  const toggleStagiaire = (id: string) => {
    setSelectedStagiaires(current => 
      current.includes(id)
        ? current.filter(sId => sId !== id)
        : [...current, id]
    );
  };
  
  const handleSubmit = () => {
    if (!mission) return;
    
    onAssign(mission.id, selectedStagiaires);
    onOpenChange(false);
    
    toast({
      title: "Stagiaires assignés",
      description: "Les stagiaires ont été assignés à la mission avec succès."
    });
  };
  
  if (!mission) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assigner des stagiaires à la mission</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <h3 className="font-medium mb-2">{mission.titre}</h3>
          <p className="text-sm text-muted-foreground mb-4">{mission.description}</p>
          
          <div className="font-medium mb-2">Sélectionner les stagiaires à assigner :</div>
          
          <ScrollArea className="h-[300px] border rounded-md p-2">
            <div className="space-y-2">
              {stagiaires.length === 0 ? (
                <p className="text-sm text-muted-foreground p-2">Aucun stagiaire disponible</p>
              ) : (
                stagiaires.map((stagiaire) => (
                  <div key={stagiaire.id} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md">
                    <Checkbox 
                      id={`stagiaire-${stagiaire.id}`} 
                      checked={selectedStagiaires.includes(stagiaire.id)}
                      onCheckedChange={() => toggleStagiaire(stagiaire.id)}
                    />
                    <Label 
                      htmlFor={`stagiaire-${stagiaire.id}`}
                      className="flex-1 cursor-pointer"
                    >
                      {stagiaire.prenom} {stagiaire.nom}
                    </Label>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Assigner {selectedStagiaires.length} stagiaire{selectedStagiaires.length !== 1 ? "s" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

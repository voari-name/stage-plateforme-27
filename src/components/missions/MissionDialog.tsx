
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MissionForm, MissionFormValues } from "./MissionForm";
import { MissionType } from "./MissionCard";
import { useToast } from "@/hooks/use-toast";

interface MissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (mission: MissionFormValues) => void;
  mission?: MissionType;
  title: string;
  language: string;
}

export function MissionDialog({ 
  open, 
  onOpenChange, 
  onSubmit,
  mission,
  title,
  language
}: MissionDialogProps) {
  const { toast } = useToast();
  
  // Convert string dates to Date objects for the form
  const convertedMission = mission ? {
    ...mission,
    dateDebut: mission.dateDebut ? parseDate(mission.dateDebut) : undefined,
    dateFin: mission.dateFin ? parseDate(mission.dateFin) : undefined,
  } : undefined;
  
  // Helper function to parse date strings into Date objects
  function parseDate(dateStr: string): Date | undefined {
    if (!dateStr) return undefined;
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  }
  
  const handleSubmit = (values: MissionFormValues) => {
    onSubmit(values);
    onOpenChange(false);
    
    toast({
      title: mission 
        ? language === "fr" ? "Mission modifiée" 
          : language === "en" ? "Mission updated" 
          : "Iraka nohavaozina"
        : language === "fr" ? "Mission créée" 
          : language === "en" ? "Mission created" 
          : "Iraka noforonina",
      description: mission 
        ? language === "fr" ? "Les modifications ont été enregistrées avec succès." 
          : language === "en" ? "The changes have been successfully saved." 
          : "Voatahiry soa aman-tsara ny fanovana."
        : language === "fr" ? "La nouvelle mission a été créée avec succès." 
          : language === "en" ? "The new mission has been successfully created." 
          : "Nahomby ny famoronana ny iraka vaovao."
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <MissionForm 
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          initialValues={convertedMission}
          isEdit={!!mission}
          language={language}
        />
      </DialogContent>
    </Dialog>
  );
}

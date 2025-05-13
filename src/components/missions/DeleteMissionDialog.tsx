
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MissionType } from "./MissionCard";

interface DeleteMissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mission?: MissionType;
  onDelete: () => void;
  language: string;
}

export function DeleteMissionDialog({
  open,
  onOpenChange,
  mission,
  onDelete,
  language
}: DeleteMissionDialogProps) {
  if (!mission) return null;

  const getTitle = () => {
    return language === "fr" ? "Supprimer la mission" :
           language === "en" ? "Delete mission" :
           "Hamafa ny iraka";
  };

  const getDescription = () => {
    return language === "fr" ? "Êtes-vous sûr de vouloir supprimer cette mission ? Cette action ne peut pas être annulée." :
           language === "en" ? "Are you sure you want to delete this mission? This action cannot be undone." :
           "Azonao antoka ve fa tianao hofafaina io iraka io? Tsy azo averina intsony ity asa ity.";
  };

  const getCancelText = () => {
    return language === "fr" ? "Annuler" :
           language === "en" ? "Cancel" :
           "Ajanony";
  };

  const getDeleteText = () => {
    return language === "fr" ? "Supprimer" :
           language === "en" ? "Delete" :
           "Fafao";
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-background">
        <AlertDialogHeader>
          <AlertDialogTitle>{getTitle()}</AlertDialogTitle>
          <AlertDialogDescription>
            {getDescription()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-2">
          <div className="rounded-lg p-4 bg-muted/50">
            <h4 className="font-medium text-sm mb-1">{mission.titre}</h4>
            <p className="text-xs text-muted-foreground">{mission.description}</p>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-primary/20 hover:bg-primary/5">
            {getCancelText()}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onDelete}
            className="bg-destructive hover:bg-destructive/90"
          >
            {getDeleteText()}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

interface DeleteProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  project: Project;
}

export function DeleteProjectDialog({ 
  open, 
  onOpenChange, 
  onConfirm, 
  project 
}: DeleteProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-center">Confirmer la suppression</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center py-4">
          Êtes-vous sûr de vouloir supprimer le projet <strong>"{project.title}"</strong> ?
          <br />
          Cette action est irréversible.
        </DialogDescription>
        <DialogFooter className="flex justify-center space-x-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (projectData: {
    title: string;
    description: string;
  }) => void;
}

export function CreateProjectDialog({ open, onOpenChange, onSubmit }: CreateProjectDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Submit the form data
    onSubmit(formData);
    
    // Reset form and close dialog after submission
    setTimeout(() => {
      setFormData({
        title: "",
        description: "",
      });
      setIsSubmitting(false);
      onOpenChange(false);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau projet</DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous pour créer un nouveau projet.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre du projet</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Entrez le titre du projet"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              placeholder="Décrivez votre projet"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.title || !formData.description}>
              {isSubmitting ? "Création en cours..." : "Créer le projet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

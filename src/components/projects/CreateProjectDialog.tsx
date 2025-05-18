
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
import { useState, useRef } from "react";
import { Paperclip, File, FileImage, Download } from "lucide-react";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (projectData: {
    title: string;
    description: string;
    attachmentFile?: File | null;
  }) => void;
}

export function CreateProjectDialog({ open, onOpenChange, onSubmit }: CreateProjectDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Submit the form data with the attachment
    onSubmit({ ...formData, attachmentFile });
    
    // Reset form and close dialog after submission
    setTimeout(() => {
      setFormData({
        title: "",
        description: "",
      });
      setAttachmentFile(null);
      setIsSubmitting(false);
      onOpenChange(false);
    }, 500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachmentFile(e.target.files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };
  
  const getFileIcon = () => {
    if (!attachmentFile) return null;
    
    const fileType = attachmentFile.type;
    
    if (fileType.startsWith('image/')) {
      return <FileImage className="w-4 h-4 text-blue-500" />;
    }
    
    return <File className="w-4 h-4 text-blue-500" />;
  };

  // Créer une URL temporaire pour le téléchargement du fichier
  const getDownloadUrl = () => {
    if (!attachmentFile) return null;
    return URL.createObjectURL(attachmentFile);
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
              placeholder="Décrivez votre projet ou ajoutez un fichier ci-dessous"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Fichier descriptif (optionnel)</Label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.ppt,.pptx,image/*"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleBrowseClick} 
                className="flex items-center gap-2"
              >
                <Paperclip className="w-4 h-4" />
                Ajouter un fichier
              </Button>
            </div>
            
            {attachmentFile && (
              <div className="flex items-center gap-2 p-2 rounded-md bg-blue-50 text-blue-900">
                {getFileIcon()}
                <span className="text-sm font-medium truncate flex-1">{attachmentFile.name}</span>
                <a 
                  href={getDownloadUrl() || '#'} 
                  download={attachmentFile.name}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download className="h-4 w-4" />
                  <span className="text-xs">Télécharger</span>
                </a>
                <button 
                  type="button" 
                  onClick={() => setAttachmentFile(null)} 
                  className="text-blue-600 hover:text-blue-800 text-xs"
                >
                  Supprimer
                </button>
              </div>
            )}
            
            <p className="text-xs text-muted-foreground">
              Formats acceptés: PDF, Word, PowerPoint, images
            </p>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.title}>
              {isSubmitting ? "Création en cours..." : "Créer le projet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Download, FileImage, File } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  created_at: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: string;
}

interface EditProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (projectData: {
    title: string;
    description: string;
    attachmentFile?: File | null;
  }) => void;
  project: Project;
}

export function EditProjectDialog({ open, onOpenChange, onSubmit, project }: EditProjectDialogProps) {
  const [formData, setFormData] = useState({
    title: project.title,
    description: project.description,
  });
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form data when project changes
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setFormData({
        title: project.title,
        description: project.description,
      });
      setAttachmentFile(null);
    }
    onOpenChange(open);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Submit the form data with the optional attachment
    onSubmit({ ...formData, attachmentFile });
    
    // Reset submission state after a short delay
    setTimeout(() => {
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
    if (attachmentFile) {
      const fileType = attachmentFile.type;
      if (fileType.startsWith('image/')) {
        return <FileImage className="w-4 h-4 text-blue-500" />;
      }
      return <File className="w-4 h-4 text-blue-500" />;
    } 
    
    if (project.attachmentType?.startsWith('image/')) {
      return <FileImage className="w-4 h-4 text-blue-500" />;
    }
    
    return <File className="w-4 h-4 text-blue-500" />;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier le projet</DialogTitle>
          <DialogDescription>
            Modifiez les informations du projet.
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
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Fichier descriptif (optionnel)</Label>
            
            {/* Existing attachment */}
            {project.attachmentUrl && !attachmentFile && (
              <div className="flex items-center gap-2 p-2 rounded-md bg-blue-50 text-blue-900">
                {getFileIcon()}
                <span className="text-sm font-medium truncate flex-1">
                  {project.attachmentName || "Pièce jointe"}
                </span>
                <a 
                  href={project.attachmentUrl} 
                  target="_blank" 
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-xs">Télécharger</span>
                </a>
                <button 
                  type="button" 
                  onClick={() => handleBrowseClick()} 
                  className="text-blue-600 hover:text-blue-800 text-xs"
                >
                  Remplacer
                </button>
              </div>
            )}
            
            {/* New attachment or no attachment at all */}
            {(!project.attachmentUrl || attachmentFile) && (
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
                  {project.attachmentUrl ? "Remplacer le fichier" : "Ajouter un fichier"}
                </Button>
              </div>
            )}
            
            {attachmentFile && (
              <div className="flex items-center gap-2 p-2 rounded-md bg-blue-50 text-blue-900">
                {getFileIcon()}
                <span className="text-sm font-medium truncate flex-1">{attachmentFile.name}</span>
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
            <Button type="submit" disabled={isSubmitting || !formData.title || !formData.description}>
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

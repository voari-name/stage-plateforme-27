import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Plus, Edit, Trash2, Paperclip, Download, FileText, Flag } from "lucide-react";
import { useState, useEffect } from "react";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { EditProjectDialog } from "@/components/projects/EditProjectDialog";
import { DeleteProjectDialog } from "@/components/projects/DeleteProjectDialog";
import { useToast } from "@/components/ui/use-toast";
import { generateProjectPDF, generateProjectsListPDF } from "@/utils/projectPdfUtils";

interface Project {
  id: string;
  title: string;
  description: string;
  created_at: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: string;
}

export default function GestionProjets() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    setLoading(true);
    try {
      // Récupérer les projets depuis le localStorage
      const savedProjects = localStorage.getItem('projects');
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects));
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les projets"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProjectAttachment = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        // Simuler le stockage du fichier en utilisant le localStorage
        // Dans une application réelle, vous utiliseriez un stockage approprié comme Supabase Storage
        const attachmentId = `attachment-${Date.now()}`;
        localStorage.setItem(attachmentId, reader.result as string);
        resolve(attachmentId);
      };
      
      reader.readAsDataURL(file);
    });
  };

  const handleProjectCreate = async (projectData: { 
    title: string; 
    description: string;
    attachmentFile?: File | null;
  }) => {
    try {
      // Préparer les données du projet
      const newProject: Project = {
        id: Date.now().toString(),
        title: projectData.title,
        description: projectData.description,
        created_at: new Date().toISOString()
      };
      
      // Gérer l'upload de fichier si présent
      if (projectData.attachmentFile) {
        const attachmentId = await saveProjectAttachment(projectData.attachmentFile);
        newProject.attachmentUrl = attachmentId;
        newProject.attachmentName = projectData.attachmentFile.name;
        newProject.attachmentType = projectData.attachmentFile.type;
      }

      const updatedProjects = [newProject, ...projects];
      
      // Sauvegarder dans le localStorage
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      
      setProjects(updatedProjects);
      toast({
        title: "Succès",
        description: "Projet créé avec succès"
      });
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le projet"
      });
    }
  };

  const handleProjectEdit = async (projectData: { 
    title: string; 
    description: string;
    attachmentFile?: File | null;
  }) => {
    if (!selectedProject) return;
    
    try {
      // Préparer la mise à jour du projet
      const updatedProject = { 
        ...selectedProject,
        title: projectData.title,
        description: projectData.description
      };
      
      // Gérer la mise à jour du fichier si nécessaire
      if (projectData.attachmentFile) {
        // Supprimer l'ancien fichier si nécessaire (dans une app réelle)
        // if (selectedProject.attachmentUrl) {
        //   await deleteAttachment(selectedProject.attachmentUrl);
        // }
        
        const attachmentId = await saveProjectAttachment(projectData.attachmentFile);
        updatedProject.attachmentUrl = attachmentId;
        updatedProject.attachmentName = projectData.attachmentFile.name;
        updatedProject.attachmentType = projectData.attachmentFile.type;
      }
      
      const updatedProjects = projects.map(project => 
        project.id === selectedProject.id ? updatedProject : project
      );
      
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      setProjects(updatedProjects);
      toast({
        title: "Succès",
        description: "Projet modifié avec succès"
      });
      setEditDialogOpen(false);
      setSelectedProject(null);
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le projet"
      });
    }
  };

  const handleProjectDelete = () => {
    if (!selectedProject) return;
    
    try {
      // Supprimer également le fichier joint (si présent)
      if (selectedProject.attachmentUrl) {
        localStorage.removeItem(selectedProject.attachmentUrl);
      }
      
      const updatedProjects = projects.filter(project => project.id !== selectedProject.id);
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      setProjects(updatedProjects);
      toast({
        title: "Succès",
        description: "Projet supprimé avec succès"
      });
      setDeleteDialogOpen(false);
      setSelectedProject(null);
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le projet"
      });
    }
  };

  const openEditDialog = (project: Project) => {
    setSelectedProject(project);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (project: Project) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  };
  
  const handleDownloadAttachment = (project: Project) => {
    if (!project.attachmentUrl) return;
    
    try {
      // Récupérer le fichier depuis le localStorage
      const fileData = localStorage.getItem(project.attachmentUrl);
      if (!fileData) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Fichier introuvable"
        });
        return;
      }
      
      // Créer un lien de téléchargement
      const a = document.createElement('a');
      a.href = fileData;
      a.download = project.attachmentName || 'fichier-projet';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading attachment:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de télécharger le fichier"
      });
    }
  };

  // Generate PDF for a specific project
  const handleGenerateProjectPDF = (project: Project) => {
    try {
      generateProjectPDF(project);
      toast({
        title: "Succès",
        description: "PDF du projet généré avec succès"
      });
    } catch (error) {
      console.error('Error generating project PDF:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer le PDF du projet"
      });
    }
  };

  // Generate PDF for all projects
  const handleGenerateProjectsListPDF = () => {
    try {
      generateProjectsListPDF(projects);
      toast({
        title: "Succès",
        description: "PDF de la liste des projets généré avec succès"
      });
    } catch (error) {
      console.error('Error generating projects list PDF:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer le PDF de la liste des projets"
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Gestion de Projet</h1>
          <div className="flex gap-2">
            {projects.length > 0 && (
              <Button 
                onClick={handleGenerateProjectsListPDF}
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <FileText className="w-4 h-4 mr-2" />
                Exporter PDF
              </Button>
            )}
            <Button 
              onClick={() => setCreateDialogOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer un projet
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="text-blue-600 font-semibold">Chargement...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects && projects.length > 0 ? (
              projects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-all duration-300 hover:scale-[1.01] border-blue-100">
                  <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-transparent">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>Créé le: {new Date(project.created_at).toLocaleDateString()}</span>
                      </div>
                      
                      {project.attachmentUrl && (
                        <div className="flex items-center gap-2 p-2 rounded-md bg-blue-50 text-blue-700 mt-2">
                          <Paperclip className="h-4 w-4" />
                          <span className="text-sm truncate flex-1">{project.attachmentName || "Pièce jointe"}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-2 text-blue-700 hover:text-blue-800 hover:bg-blue-100"
                            onClick={() => handleDownloadAttachment(project)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 pt-2 border-t border-blue-50">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleGenerateProjectPDF(project)}
                      className="text-blue-700 hover:bg-blue-50"
                    >
                      <FileText className="h-4 w-4 mr-1" /> PDF
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openEditDialog(project)}
                      className="border-blue-200 hover:bg-blue-50 text-blue-700"
                    >
                      <Edit className="h-4 w-4 mr-1" /> Modifier
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => openDeleteDialog(project)}
                      className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 border-none"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Supprimer
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card className="col-span-full text-center p-6">
                <p className="text-muted-foreground">Aucun projet créé pour le moment</p>
                <Button 
                  onClick={() => setCreateDialogOpen(true)} 
                  variant="outline" 
                  className="mt-4 border-blue-200 text-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer votre premier projet
                </Button>
              </Card>
            )}
          </div>
        )}
      </div>
      <CreateProjectDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleProjectCreate}
      />
      {selectedProject && (
        <>
          <EditProjectDialog 
            open={editDialogOpen} 
            onOpenChange={setEditDialogOpen}
            onSubmit={handleProjectEdit}
            project={selectedProject}
          />
          <DeleteProjectDialog 
            open={deleteDialogOpen} 
            onOpenChange={setDeleteDialogOpen}
            onConfirm={handleProjectDelete}
            project={selectedProject}
          />
        </>
      )}
    </Layout>
  );
}

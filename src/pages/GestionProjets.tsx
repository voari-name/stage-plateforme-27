
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { EditProjectDialog } from "@/components/projects/EditProjectDialog";
import { DeleteProjectDialog } from "@/components/projects/DeleteProjectDialog";
import { useToast } from "@/components/ui/use-toast";

interface Project {
  id: string;
  title: string;
  description: string;
  created_at: string;
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

  const handleProjectCreate = (projectData: { title: string; description: string }) => {
    try {
      // Créer un nouveau projet avec un ID unique
      const newProject = {
        id: Date.now().toString(),
        title: projectData.title,
        description: projectData.description,
        created_at: new Date().toISOString()
      };

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

  const handleProjectEdit = (projectData: { title: string; description: string }) => {
    if (!selectedProject) return;
    
    try {
      const updatedProjects = projects.map(project => 
        project.id === selectedProject.id 
        ? { ...project, title: projectData.title, description: projectData.description } 
        : project
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

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Gestion de Projet</h1>
          <Button 
            onClick={() => setCreateDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer un projet
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="text-blue-600 font-semibold">Chargement...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects && projects.length > 0 ? (
              projects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                      <p className="text-sm text-muted-foreground">
                        Créé le: {new Date(project.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openEditDialog(project)}
                      className="hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4 mr-1" /> Modifier
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => openDeleteDialog(project)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Supprimer
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card className="col-span-full text-center p-6">
                <p className="text-muted-foreground">Aucun projet créé pour le moment</p>
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

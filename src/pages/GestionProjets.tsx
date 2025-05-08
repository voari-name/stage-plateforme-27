
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { useToast } from "@/components/ui/use-toast";

interface Project {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

export default function GestionProjets() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
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
    </Layout>
  );
}


import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

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

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les projets"
      });
    }
  };

  const handleProjectCreate = async (projectData: { title: string; description: string }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...projectData, user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;

      setProjects([data, ...projects]);
      setCreateDialogOpen(false);
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
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
          ))}
          {projects.length === 0 && (
            <Card className="col-span-full text-center p-6">
              <p className="text-muted-foreground">Aucun projet créé pour le moment</p>
            </Card>
          )}
        </div>
      </div>
      <CreateProjectDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleProjectCreate}
      />
    </Layout>
  );
}

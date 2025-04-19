
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";

interface Project {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export default function GestionProjets() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  const handleProjectCreate = (projectData: Omit<Project, "id">) => {
    const newProject = {
      ...projectData,
      id: crypto.randomUUID()
    };
    setProjects([...projects, newProject]);
    setCreateDialogOpen(false);
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
                  <div className="text-sm">
                    <p>Date de début: {new Date(project.startDate).toLocaleDateString()}</p>
                    <p>Date de fin: {new Date(project.endDate).toLocaleDateString()}</p>
                  </div>
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

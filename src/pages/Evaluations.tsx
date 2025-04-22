
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, FileDown, FilePenLine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addNotification } from "@/utils/notificationUtils";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { EvaluationForm } from "@/components/evaluations/EvaluationForm";
import { EvaluationCard } from "@/components/evaluations/EvaluationCard";
import { EmptyState } from "@/components/evaluations/EmptyState";
import { generatePDF } from "@/utils/pdfUtils";

type Evaluation = {
  id: string;
  nom: string;
  prenom: string;
  note: number;
  genre: "masculin" | "feminin";
  status: "reviewed";
  date: string;
  email?: string;
  telephone?: string;
  etablissement?: string;
  formation?: string;
  dateDebut?: string;
  dateFin?: string;
};

const Evaluations = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [evaluationToDelete, setEvaluationToDelete] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const savedEvaluations = localStorage.getItem("evaluations");
    if (savedEvaluations) {
      setEvaluations(JSON.parse(savedEvaluations));
    }
  }, []);
  
  const handleCreateEvaluation = (newEvaluation: Omit<Evaluation, "id" | "date" | "status">) => {
    const evaluation: Evaluation = {
      ...newEvaluation,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('fr-FR'),
      status: "reviewed"
    };
    
    const updatedEvaluations = [...evaluations, evaluation];
    setEvaluations(updatedEvaluations);
    localStorage.setItem("evaluations", JSON.stringify(updatedEvaluations));
    
    toast({
      title: "Évaluation créée",
      description: `L'évaluation pour ${evaluation.prenom} ${evaluation.nom} a été créée avec succès.`,
    });
    
    addNotification(
      "Nouvelle évaluation",
      `Une évaluation a été créée pour ${evaluation.prenom} ${evaluation.nom}.`
    );
    
    setActiveTab("reviewed");
    setShowForm(false);
    setIsDialogOpen(false);
  };

  const handleDeleteEvaluation = () => {
    if (evaluationToDelete) {
      const evaluationToRemove = evaluations.find(item => item.id === evaluationToDelete);
      if (evaluationToRemove) {
        const updatedEvaluations = evaluations.filter(item => item.id !== evaluationToDelete);
        setEvaluations(updatedEvaluations);
        localStorage.setItem("evaluations", JSON.stringify(updatedEvaluations));
        
        toast({
          title: "Évaluation supprimée",
          description: `L'évaluation de ${evaluationToRemove.prenom} ${evaluationToRemove.nom} a été supprimée avec succès.`,
        });
      }
      setEvaluationToDelete(null);
    }
  };

  const handleDownloadPDF = (id?: string) => {
    const evaluationsForPDF = evaluations
      .filter(e => !id || e.id === id)
      .map(evaluation => ({
        id: evaluation.id,
        nom: evaluation.nom,
        prenom: evaluation.prenom,
        email: evaluation.email || '',
        telephone: evaluation.telephone || '',
        etablissement: evaluation.etablissement || 'Non spécifié',
        formation: evaluation.formation || 'Non spécifié',
        status: evaluation.status === 'reviewed' ? 'Évaluée' : 'En attente',
        dateDebut: evaluation.dateDebut || evaluation.date,
        dateFin: evaluation.dateFin || evaluation.date
      }));

    if (evaluationsForPDF.length === 0) {
      toast({
        title: "Aucune évaluation",
        description: "Il n'y a aucune évaluation à télécharger.",
        variant: "destructive"
      });
      return;
    }

    generatePDF(evaluationsForPDF);
    
    toast({
      title: "Téléchargement en cours",
      description: id ? 
        `Le rapport d'évaluation est en cours de téléchargement.` :
        "Le rapport d'évaluations est en cours de téléchargement.",
    });
  };

  const filteredEvaluations = evaluations.filter((evaluation) => {
    if (activeTab !== "all" && evaluation.status !== activeTab) return false;
    return true;
  });

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 dark:text-white">
          <div className="mx-auto max-w-7xl">
            <div className="w-full">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-300">Évaluations</h1>
                <div className="flex gap-2">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 transition-all duration-300">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Créer une évaluation
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Nouvelle évaluation</DialogTitle>
                        <DialogDescription>
                          Formulaire de création d'une évaluation de stage
                        </DialogDescription>
                      </DialogHeader>
                      
                      {showForm ? (
                        <EvaluationForm 
                          onSubmit={handleCreateEvaluation}
                          onCancel={() => {
                            setShowForm(false);
                            setIsDialogOpen(false);
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center py-4 space-y-4">
                          <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2">
                            <FilePenLine className="h-10 w-10 text-blue-600 dark:text-blue-300" />
                          </div>
                          <h3 className="font-medium text-lg text-center">Formulaire d'évaluation</h3>
                          <p className="text-sm text-muted-foreground text-center dark:text-gray-400 mb-2">
                            Cliquez sur le bouton ci-dessous pour ouvrir le formulaire d'évaluation.
                          </p>
                          <Button 
                            onClick={() => setShowForm(true)}
                            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                          >
                            <FilePenLine className="h-4 w-4 mr-2" />
                            Ouvrir le formulaire
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setShowForm(false);
                              setIsDialogOpen(false);
                            }}
                            className="w-full mt-2"
                          >
                            Annuler
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
                    onClick={() => handleDownloadPDF()}
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Télécharger PDF
                  </Button>
                </div>
              </div>
              
              <div className="mb-6">
                <Tabs
                  defaultValue="all"
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="bg-white/50 backdrop-blur-sm dark:bg-slate-800/50 w-full md:w-auto">
                    <TabsTrigger value="all" className="flex-1 md:flex-none">Toutes</TabsTrigger>
                    <TabsTrigger value="reviewed" className="flex-1 md:flex-none">Évaluées</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="space-y-4">
                {filteredEvaluations.map((evaluation) => (
                  <EvaluationCard
                    key={evaluation.id}
                    evaluation={evaluation}
                    onDelete={(id) => setEvaluationToDelete(id)}
                    onDownload={(id) => handleDownloadPDF(id)}
                  />
                ))}
                
                {filteredEvaluations.length === 0 && <EmptyState />}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <AlertDialog open={!!evaluationToDelete} onOpenChange={(open) => {
        if (!open) setEvaluationToDelete(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette évaluation ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteEvaluation}
              className="bg-red-500 hover:bg-red-600"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Evaluations;

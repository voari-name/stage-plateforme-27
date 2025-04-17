import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, FileText, FileDown, Trash2, PlusCircle, FilePenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { EvaluationForm } from "@/components/evaluations/EvaluationForm";
import { generatePDF } from "@/utils/pdfUtils";

type EvaluationStatus = "reviewed";

type Evaluation = {
  id: string;
  nom: string;
  prenom: string;
  note: number;
  genre: "masculin" | "feminin";
  status: EvaluationStatus;
  date: string;
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
    
    setShowForm(false);
    setIsDialogOpen(false);
  };
  
  const getEvaluationStatusConfig = (status: EvaluationStatus) => {
    return {
      reviewed: { 
        label: "Évaluée", 
        className: "bg-success text-success-foreground",
        icon: <Eye className="h-4 w-4 mr-1" />
      }
    }[status];
  };
  
  const filteredEvaluations = evaluations.filter((evaluation) => {
    if (activeTab !== "all" && evaluation.status !== activeTab) return false;
    return true;
  });

  const handleDownloadPDF = (id?: string) => {
    if (id) {
      const evaluation = evaluations.find(item => item.id === id);
      if (evaluation) {
        generatePDF([evaluation]);
        toast({
          title: "Téléchargement en cours",
          description: `Le rapport d'évaluation pour ${evaluation.prenom} ${evaluation.nom} est en cours de téléchargement.`,
        });
        return;
      }
    }

    if (filteredEvaluations.length === 0) {
      toast({
        title: "Aucune évaluation",
        description: "Il n'y a aucune évaluation à télécharger.",
        variant: "destructive"
      });
      return;
    }

    generatePDF(filteredEvaluations);
    
    toast({
      title: "Téléchargement en cours",
      description: "Le rapport d'évaluations est en cours de téléchargement.",
    });
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
  
  const handleCloseDialog = () => {
    setShowForm(false);
    setIsDialogOpen(false);
  };
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 dark:text-white">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Colonne de gauche - Liste des évaluations */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-300">Évaluations</h1>
                  <div className="flex gap-2">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 transition-all duration-300"
                        >
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
                            onCancel={handleCloseDialog}
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
                              onClick={handleCloseDialog}
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
                  {filteredEvaluations.map((evaluation) => {
                    const statusConfig = getEvaluationStatusConfig(evaluation.status);
                    
                    return (
                      <Card key={evaluation.id} className="hover:shadow-lg transition-all duration-300 border-blue-200 dark:border-blue-900 dark:bg-slate-800">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-10 w-10 border-2 border-blue-200 dark:border-blue-700">
                                <AvatarFallback className={cn(
                                  "bg-gradient-to-br text-white",
                                  evaluation.genre === "feminin" ? "from-pink-400 to-rose-500" : "from-blue-400 to-indigo-500"
                                )}>
                                  {evaluation.prenom[0]}
                                  {evaluation.nom[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium text-lg dark:text-white">Évaluation de stage</h3>
                                <p className="text-sm text-muted-foreground dark:text-gray-300">
                                  {evaluation.prenom} {evaluation.nom}
                                </p>
                              </div>
                            </div>
                            <Badge className={cn("font-normal flex items-center", statusConfig.className)}>
                              {statusConfig.icon}
                              {statusConfig.label}
                            </Badge>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pb-2">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center text-sm">
                                <span className="text-muted-foreground dark:text-gray-400 min-w-28">Genre:</span>
                                <span className="dark:text-white">{evaluation.genre === "masculin" ? "Masculin" : "Féminin"}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <span className="text-muted-foreground dark:text-gray-400 min-w-28">Date d'évaluation:</span>
                                <span className="dark:text-white">{evaluation.date}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              <div className={cn(
                                "h-16 w-16 rounded-full flex items-center justify-center text-white",
                                evaluation.note >= 16 ? "bg-gradient-to-r from-green-400 to-green-600" :
                                evaluation.note >= 12 ? "bg-gradient-to-r from-blue-400 to-blue-600" :
                                evaluation.note >= 8 ? "bg-gradient-to-r from-yellow-400 to-yellow-600" :
                                "bg-gradient-to-r from-red-400 to-red-600"
                              )}>
                                <span className="text-xl font-bold">{evaluation.note}</span>
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium dark:text-gray-200">Note</p>
                                <p className="text-xs text-muted-foreground dark:text-gray-400">sur 20</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        
                        <CardFooter className="border-t border-blue-100 dark:border-blue-900 pt-4 flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setEvaluationToDelete(evaluation.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Supprimer
                          </Button>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                            onClick={() => handleDownloadPDF(evaluation.id)}
                          >
                            <FileDown className="h-4 w-4 mr-1" />
                            Télécharger PDF
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                  
                  {filteredEvaluations.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-white/50 backdrop-blur-sm rounded-xl shadow-md dark:bg-slate-800/50 dark:text-white">
                      <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                        <FileText className="h-10 w-10 text-blue-600 dark:text-blue-300" />
                      </div>
                      <h3 className="font-medium text-lg mb-1">Aucune évaluation trouvée</h3>
                      <p className="text-muted-foreground dark:text-gray-400 mb-4">
                        Utilisez le formulaire pour créer une nouvelle évaluation.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Colonne de droite - Statistiques et infos */}
              <div className="lg:col-span-1">
                <Card className="border-blue-200 dark:border-blue-900 dark:bg-slate-800 mb-6">
                  <CardHeader>
                    <h2 className="text-xl font-semibold dark:text-white">Résumé des évaluations</h2>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Statistiques et informations sur les évaluations
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/40 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground dark:text-gray-400">Nombre total</p>
                          <p className="text-2xl font-bold dark:text-white">{evaluations.length}</p>
                        </div>
                        <div className="h-10 w-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                        </div>
                      </div>
                      
                      <div className="flex justify-center mt-6">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                            >
                              <PlusCircle className="h-4 w-4 mr-2" />
                              Créer une évaluation
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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

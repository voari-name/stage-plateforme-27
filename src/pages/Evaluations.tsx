import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, FileText, Plus, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { 
  Drawer,
  DrawerClose,
  DrawerContent, 
  DrawerDescription, 
  DrawerFooter, 
  DrawerHeader, 
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import { EvaluationForm } from "@/components/evaluations/EvaluationForm";
import { generatePDF } from "@/utils/pdfUtils";

type EvaluationStatus = "pending" | "reviewed";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
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
      status: "pending"
    };
    
    const updatedEvaluations = [...evaluations, evaluation];
    setEvaluations(updatedEvaluations);
    localStorage.setItem("evaluations", JSON.stringify(updatedEvaluations));
    
    setDrawerOpen(false);
    toast({
      title: "Évaluation créée",
      description: `L'évaluation pour ${evaluation.prenom} ${evaluation.nom} a été créée avec succès.`,
    });
  };
  
  const getEvaluationStatusConfig = (status: EvaluationStatus) => {
    const config = {
      pending: { 
        label: "En attente", 
        className: "bg-warning text-warning-foreground",
        icon: <FileText className="h-4 w-4 mr-1" />
      },
      reviewed: { 
        label: "Évaluée", 
        className: "bg-success text-success-foreground",
        icon: <Eye className="h-4 w-4 mr-1" />
      },
    };
    
    return config[status];
  };
  
  const filteredEvaluations = evaluations.filter((evaluation) => {
    if (activeTab !== "all" && evaluation.status !== activeTab) return false;
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const stagiaireNom = `${evaluation.prenom} ${evaluation.nom}`.toLowerCase();
      
      return stagiaireNom.includes(searchLower);
    }
    
    return true;
  });

  const handleDownloadPDF = (id?: string) => {
    // If id is provided, download PDF for a specific evaluation
    if (id) {
      const evaluation = evaluations.find(eval => eval.id === id);
      if (evaluation) {
        generatePDF([evaluation]);
        toast({
          title: "Téléchargement en cours",
          description: `Le rapport d'évaluation pour ${evaluation.prenom} ${evaluation.nom} est en cours de téléchargement.`,
        });
        return;
      }
    }

    // Otherwise download all filtered evaluations
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
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 dark:text-white">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-300">Évaluations</h1>
              <div className="flex gap-2">
                <Button 
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
                  onClick={() => handleDownloadPDF()}
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Télécharger PDF
                </Button>
                <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                  <DrawerTrigger asChild>
                    <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 transition-all duration-300">
                      <Plus className="h-4 w-4 mr-2" />
                      Créer une évaluation
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="dark:bg-slate-800">
                    <div className="mx-auto w-full max-w-3xl">
                      <DrawerHeader className="text-left">
                        <DrawerTitle className="text-2xl font-bold dark:text-white">Créer une évaluation</DrawerTitle>
                        <DrawerDescription className="dark:text-gray-300">
                          Remplissez le formulaire ci-dessous pour créer une nouvelle évaluation.
                        </DrawerDescription>
                      </DrawerHeader>
                      <div className="p-4">
                        <EvaluationForm onSubmit={handleCreateEvaluation} onCancel={() => setDrawerOpen(false)} />
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <Tabs
                defaultValue="all"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full sm:w-auto"
              >
                <TabsList className="bg-white/50 backdrop-blur-sm dark:bg-slate-800/50">
                  <TabsTrigger value="all">Toutes</TabsTrigger>
                  <TabsTrigger value="pending">En attente</TabsTrigger>
                  <TabsTrigger value="reviewed">Évaluées</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex w-full sm:w-auto">
                <Input
                  placeholder="Rechercher une évaluation..."
                  className="w-full sm:w-[250px] bg-white/80 dark:bg-slate-700/80 border-blue-200 dark:border-blue-900"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
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
                    {searchTerm 
                      ? "Aucune évaluation ne correspond à votre recherche."
                      : "Commencez par créer une nouvelle évaluation !"}
                  </p>
                  {searchTerm && (
                    <Button variant="outline" onClick={() => setSearchTerm("")} className="dark:text-white dark:border-blue-700">
                      Réinitialiser la recherche
                    </Button>
                  )}
                  {!searchTerm && (
                    <Button 
                      onClick={() => setDrawerOpen(true)}
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Créer une évaluation
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Evaluations;

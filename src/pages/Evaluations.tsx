
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DownloadCloud,
  ExternalLink,
  Eye,
  FileCheck,
  FileText,
  Filter,
  Plus,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type EvaluationStatus = "pending" | "submitted" | "reviewed";

type Evaluation = {
  id: string;
  type: "mid_term" | "final" | "weekly";
  title: string;
  status: EvaluationStatus;
  stagiaire: {
    id: string;
    nom: string;
    prenom: string;
    avatar?: string;
  };
  mission: {
    id: string;
    titre: string;
  };
  submissionDate?: string;
  dueDate: string;
  score?: number;
  feedback?: string;
};

const MOCK_EVALUATIONS: Evaluation[] = [
  {
    id: "1",
    type: "mid_term",
    title: "Évaluation mi-parcours",
    status: "reviewed",
    stagiaire: { id: "1", nom: "Dubois", prenom: "Marie" },
    mission: { id: "1", titre: "Refonte site web" },
    submissionDate: "15/03/2025",
    dueDate: "15/03/2025",
    score: 85,
    feedback: "Excellent travail, continue ainsi !",
  },
  {
    id: "2",
    type: "weekly",
    title: "Rapport semaine 6",
    status: "submitted",
    stagiaire: { id: "2", nom: "Martin", prenom: "Thomas" },
    mission: { id: "4", titre: "Développement application mobile" },
    submissionDate: "05/04/2025",
    dueDate: "05/04/2025",
  },
  {
    id: "3",
    type: "final",
    title: "Évaluation finale",
    status: "pending",
    stagiaire: { id: "4", nom: "Petit", prenom: "Antoine" },
    mission: { id: "3", titre: "Optimisation des processus RH" },
    dueDate: "28/04/2025",
  },
  {
    id: "4",
    type: "mid_term",
    title: "Évaluation mi-parcours",
    status: "reviewed",
    stagiaire: { id: "5", nom: "Durand", prenom: "Sophie" },
    mission: { id: "5", titre: "Analyse financière" },
    submissionDate: "20/03/2025",
    dueDate: "25/03/2025",
    score: 92,
    feedback: "Très bonne analyse, propositions pertinentes.",
  },
  {
    id: "5",
    type: "weekly",
    title: "Rapport semaine 4",
    status: "pending",
    stagiaire: { id: "3", nom: "Bernard", prenom: "Lucie" },
    mission: { id: "2", titre: "Étude de marché" },
    dueDate: "12/04/2025",
  },
];

const getEvaluationStatusConfig = (status: EvaluationStatus) => {
  const config = {
    pending: { 
      label: "En attente", 
      className: "bg-warning text-warning-foreground",
      icon: <FileText className="h-4 w-4 mr-1" />
    },
    submitted: { 
      label: "Soumise", 
      className: "bg-info text-info-foreground",
      icon: <FileCheck className="h-4 w-4 mr-1" />
    },
    reviewed: { 
      label: "Évaluée", 
      className: "bg-success text-success-foreground",
      icon: <Star className="h-4 w-4 mr-1" />
    },
  };
  
  return config[status];
};

const Evaluations = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>(MOCK_EVALUATIONS);
  const [activeTab, setActiveTab] = useState<string>("all");
  const { toast } = useToast();
  
  const filteredEvaluations = evaluations.filter((evaluation) => {
    if (activeTab === "all") return true;
    return evaluation.status === activeTab;
  });
  
  const handleViewEvaluation = (id: string) => {
    toast({
      title: "Affichage de l'évaluation",
      description: `Visualisation de l'évaluation ID: ${id}`,
    });
  };
  
  const handleDownloadEvaluation = (id: string) => {
    toast({
      title: "Téléchargement",
      description: `Téléchargement de l'évaluation ID: ${id}`,
    });
  };
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Évaluations</h1>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Créer une évaluation
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <Tabs
                defaultValue="all"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full sm:w-auto"
              >
                <TabsList>
                  <TabsTrigger value="all">Toutes</TabsTrigger>
                  <TabsTrigger value="pending">En attente</TabsTrigger>
                  <TabsTrigger value="submitted">Soumises</TabsTrigger>
                  <TabsTrigger value="reviewed">Évaluées</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex w-full sm:w-auto gap-2">
                <Input
                  placeholder="Rechercher une évaluation..."
                  className="w-full sm:w-[250px]"
                />
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filtrer par" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="type">Type</SelectItem>
                    <SelectItem value="stagiaire">Stagiaire</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredEvaluations.map((evaluation) => {
                const statusConfig = getEvaluationStatusConfig(evaluation.status);
                
                return (
                  <Card key={evaluation.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={evaluation.stagiaire.avatar}
                              alt={`${evaluation.stagiaire.prenom} ${evaluation.stagiaire.nom}`}
                            />
                            <AvatarFallback>
                              {evaluation.stagiaire.prenom[0]}
                              {evaluation.stagiaire.nom[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-lg">{evaluation.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {evaluation.stagiaire.prenom} {evaluation.stagiaire.nom} - {evaluation.mission.titre}
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
                            <span className="text-muted-foreground min-w-28">Type:</span>
                            <span>
                              {evaluation.type === "mid_term" && "Évaluation mi-parcours"}
                              {evaluation.type === "final" && "Évaluation finale"}
                              {evaluation.type === "weekly" && "Rapport hebdomadaire"}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <span className="text-muted-foreground min-w-28">Date d'échéance:</span>
                            <span>{evaluation.dueDate}</span>
                          </div>
                          {evaluation.submissionDate && (
                            <div className="flex items-center text-sm">
                              <span className="text-muted-foreground min-w-28">Date de soumission:</span>
                              <span>{evaluation.submissionDate}</span>
                            </div>
                          )}
                        </div>
                        
                        {evaluation.score !== undefined && (
                          <div className="flex items-center">
                            <div className="h-16 w-16 rounded-full border-4 border-primary flex items-center justify-center">
                              <span className="text-xl font-bold">{evaluation.score}</span>
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium">Score</p>
                              <p className="text-xs text-muted-foreground">sur 100</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {evaluation.feedback && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm font-medium mb-1">Feedback:</p>
                          <p className="text-sm text-muted-foreground">
                            {evaluation.feedback}
                          </p>
                        </div>
                      )}
                    </CardContent>
                    
                    <CardFooter className="border-t pt-4 flex justify-end gap-2">
                      {evaluation.status !== "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadEvaluation(evaluation.id)}
                        >
                          <DownloadCloud className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => handleViewEvaluation(evaluation.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {evaluation.status === "submitted" ? "Évaluer" : "Voir"}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
              
              {filteredEvaluations.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                    <FileText className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-lg mb-1">Aucune évaluation trouvée</h3>
                  <p className="text-muted-foreground mb-4">
                    Aucune évaluation ne correspond à vos filtres.
                  </p>
                  <Button variant="outline" onClick={() => setActiveTab("all")}>
                    Réinitialiser les filtres
                  </Button>
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


import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Check,
  Clock,
  ClipboardList,
  Filter,
  Plus,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MissionStatus = "not_started" | "in_progress" | "completed";

type Mission = {
  id: string;
  titre: string;
  description: string;
  status: MissionStatus;
  dateDebut: string;
  dateFin: string;
  progress: number;
  departement: string;
  stagiaires: {
    id: string;
    nom: string;
    prenom: string;
    avatar?: string;
  }[];
};

const MOCK_MISSIONS: Mission[] = [
  {
    id: "1",
    titre: "Refonte site web",
    description: "Modernisation du site internet de l'entreprise",
    status: "in_progress",
    dateDebut: "01/03/2025",
    dateFin: "30/04/2025",
    progress: 65,
    departement: "Informatique",
    stagiaires: [
      { id: "1", nom: "Dubois", prenom: "Marie" },
      { id: "2", nom: "Martin", prenom: "Thomas" },
    ],
  },
  {
    id: "2",
    titre: "Étude de marché",
    description: "Analyse concurrentielle pour nouveau produit",
    status: "not_started",
    dateDebut: "15/04/2025",
    dateFin: "15/05/2025",
    progress: 0,
    departement: "Marketing",
    stagiaires: [
      { id: "3", nom: "Bernard", prenom: "Lucie" },
    ],
  },
  {
    id: "3",
    titre: "Optimisation des processus RH",
    description: "Digitalisation du processus de recrutement",
    status: "completed",
    dateDebut: "01/01/2025",
    dateFin: "28/02/2025",
    progress: 100,
    departement: "Ressources Humaines",
    stagiaires: [
      { id: "4", nom: "Petit", prenom: "Antoine" },
      { id: "5", nom: "Durand", prenom: "Sophie" },
    ],
  },
  {
    id: "4",
    titre: "Développement application mobile",
    description: "Application client pour iOS et Android",
    status: "in_progress",
    dateDebut: "15/02/2025",
    dateFin: "30/05/2025",
    progress: 40,
    departement: "Informatique",
    stagiaires: [
      { id: "2", nom: "Martin", prenom: "Thomas" },
      { id: "6", nom: "Leroy", prenom: "Maxime" },
    ],
  },
  {
    id: "5",
    titre: "Analyse financière",
    description: "Audit des finances du premier trimestre",
    status: "not_started",
    dateDebut: "01/05/2025",
    dateFin: "31/05/2025",
    progress: 0,
    departement: "Finance",
    stagiaires: [
      { id: "5", nom: "Durand", prenom: "Sophie" },
    ],
  },
];

const getMissionStatusConfig = (status: MissionStatus) => {
  const config = {
    not_started: { 
      label: "Non commencée", 
      className: "bg-muted text-muted-foreground",
      icon: <Clock className="h-4 w-4 mr-1" />
    },
    in_progress: { 
      label: "En cours", 
      className: "bg-info text-info-foreground",
      icon: <ClipboardList className="h-4 w-4 mr-1" />
    },
    completed: { 
      label: "Terminée", 
      className: "bg-success text-success-foreground",
      icon: <Check className="h-4 w-4 mr-1" />
    },
  };
  
  return config[status];
};

const Missions = () => {
  const [missions, setMissions] = useState<Mission[]>(MOCK_MISSIONS);
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const filteredMissions = missions.filter((mission) => {
    if (activeTab === "all") return true;
    return mission.status === activeTab;
  });
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Missions</h1>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle mission
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
                  <TabsTrigger value="not_started">Non commencées</TabsTrigger>
                  <TabsTrigger value="in_progress">En cours</TabsTrigger>
                  <TabsTrigger value="completed">Terminées</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex w-full sm:w-auto gap-2">
                <Input
                  placeholder="Rechercher une mission..."
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
                    <SelectItem value="departement">Département</SelectItem>
                    <SelectItem value="stagiaire">Stagiaire</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredMissions.map((mission) => {
                const statusConfig = getMissionStatusConfig(mission.status);
                
                return (
                  <Card key={mission.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{mission.titre}</h3>
                          <p className="text-sm text-muted-foreground">
                            {mission.description}
                          </p>
                        </div>
                        <Badge className={cn("font-normal flex items-center", statusConfig.className)}>
                          {statusConfig.icon}
                          {statusConfig.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {mission.dateDebut} - {mission.dateFin}
                          </span>
                        </div>
                        <span className="text-muted-foreground">
                          {mission.departement}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progression</span>
                          <span>{mission.progress}%</span>
                        </div>
                        <Progress value={mission.progress} className="h-2" />
                      </div>
                      
                      <div className="pt-2">
                        <p className="text-sm font-medium mb-2 flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          Stagiaires assignés
                        </p>
                        <div className="flex -space-x-2">
                          {mission.stagiaires.map((stagiaire) => (
                            <Avatar key={stagiaire.id} className="border-2 border-background h-8 w-8">
                              <AvatarImage src={stagiaire.avatar} alt={`${stagiaire.prenom} ${stagiaire.nom}`} />
                              <AvatarFallback className="text-xs">
                                {stagiaire.prenom[0]}{stagiaire.nom[0]}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="border-t pt-4 flex justify-end">
                      <Button variant="outline" className="mr-2">
                        Assigner
                      </Button>
                      <Button>Voir détails</Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
            
            {filteredMissions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                  <ClipboardList className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-lg mb-1">Aucune mission trouvée</h3>
                <p className="text-muted-foreground mb-4">
                  Aucune mission ne correspond à vos filtres.
                </p>
                <Button variant="outline" onClick={() => setActiveTab("all")}>
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Missions;

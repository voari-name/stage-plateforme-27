
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MissionCard, MissionType, Stagiaire } from "@/components/missions/MissionCard";
import { MissionDialog } from "@/components/missions/MissionDialog";
import { AssignStagiairesDialog } from "@/components/missions/AssignStagiairesDialog";
import { MissionFormValues } from "@/components/missions/MissionForm";
import { ClipboardList, Filter, Plus } from "lucide-react";
import { formatDate } from "@/components/missions/utils";
import { useToast } from "@/hooks/use-toast";

// Mock data
const MOCK_MISSIONS: MissionType[] = [
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

// Mock stagiaires data
const MOCK_STAGIAIRES: Stagiaire[] = [
  { id: "1", nom: "Dubois", prenom: "Marie" },
  { id: "2", nom: "Martin", prenom: "Thomas" },
  { id: "3", nom: "Bernard", prenom: "Lucie" },
  { id: "4", nom: "Petit", prenom: "Antoine" },
  { id: "5", nom: "Durand", prenom: "Sophie" },
  { id: "6", nom: "Leroy", prenom: "Maxime" },
  { id: "7", nom: "Moreau", prenom: "Julie" },
  { id: "8", nom: "Simon", prenom: "Nicolas" },
];

const Missions = () => {
  const { toast } = useToast();
  const [missions, setMissions] = useState<MissionType[]>(MOCK_MISSIONS);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  
  // Mission dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentMission, setCurrentMission] = useState<MissionType | undefined>();
  
  // Assign stagiaires dialog state
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  
  // Filter missions based on active tab and search query
  const filteredMissions = missions.filter((mission) => {
    // Filter by tab
    if (activeTab !== "all" && mission.status !== activeTab) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        mission.titre.toLowerCase().includes(query) ||
        mission.description.toLowerCase().includes(query) ||
        mission.departement.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Handle mission creation
  const handleCreateMission = (values: MissionFormValues) => {
    const newMission: MissionType = {
      id: `mission-${Date.now()}`,
      titre: values.titre,
      description: values.description,
      status: values.status,
      dateDebut: formatDate(values.dateDebut),
      dateFin: formatDate(values.dateFin),
      progress: values.progress || 0,
      departement: values.departement,
      stagiaires: []
    };
    
    setMissions([newMission, ...missions]);
  };
  
  // Handle mission update
  const handleUpdateMission = (values: MissionFormValues) => {
    if (!currentMission) return;
    
    setMissions(missions.map(mission => 
      mission.id === currentMission.id
        ? {
            ...mission,
            titre: values.titre,
            description: values.description,
            status: values.status,
            dateDebut: formatDate(values.dateDebut),
            dateFin: formatDate(values.dateFin),
            progress: values.progress || 0,
            departement: values.departement,
          }
        : mission
    ));
  };
  
  // View mission details (opens edit dialog)
  const handleViewDetails = (id: string) => {
    const mission = missions.find(m => m.id === id);
    if (mission) {
      setCurrentMission(mission);
      setEditDialogOpen(true);
    }
  };
  
  // Open assign stagiaires dialog
  const handleOpenAssignDialog = (id: string) => {
    const mission = missions.find(m => m.id === id);
    if (mission) {
      setCurrentMission(mission);
      setAssignDialogOpen(true);
    }
  };
  
  // Handle stagiaire assignment
  const handleAssignStagiaires = (missionId: string, stagiaireIds: string[]) => {
    // Find selected stagiaires from the mock data
    const selectedStagiaires = MOCK_STAGIAIRES.filter(s => stagiaireIds.includes(s.id));
    
    // Update the mission with the new stagiaires
    setMissions(missions.map(mission => 
      mission.id === missionId
        ? { ...mission, stagiaires: selectedStagiaires }
        : mission
    ));
  };
  
  return (
    <div className="flex h-screen bg-background">
      <Layout>
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Missions</h1>
              <Button onClick={() => setCreateDialogOpen(true)}>
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Select value={filterType} onValueChange={setFilterType}>
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
              {filteredMissions.map((mission) => (
                <MissionCard 
                  key={mission.id} 
                  mission={mission} 
                  onViewDetails={handleViewDetails}
                  onAssign={handleOpenAssignDialog}
                />
              ))}
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
                <Button variant="outline" onClick={() => {
                  setActiveTab("all");
                  setSearchQuery("");
                  setFilterType("");
                }}>
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        </main>
        
        {/* Create Mission Dialog */}
        <MissionDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSubmit={handleCreateMission}
          title="Créer une nouvelle mission"
        />
        
        {/* Edit Mission Dialog */}
        <MissionDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSubmit={handleUpdateMission}
          mission={currentMission}
          title="Modifier la mission"
        />
        
        {/* Assign Stagiaires Dialog */}
        <AssignStagiairesDialog
          open={assignDialogOpen}
          onOpenChange={setAssignDialogOpen}
          mission={currentMission}
          stagiaires={MOCK_STAGIAIRES}
          onAssign={handleAssignStagiaires}
        />
      </Layout>
    </div>
  );
};

export default Missions;

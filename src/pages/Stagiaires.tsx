
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { StagiaireCard, StagiaireType } from "@/components/stagiaires/StagiaireCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MOCK_STAGIAIRES: StagiaireType[] = [
  {
    id: "1",
    nom: "Dubois",
    prenom: "Marie",
    email: "marie.dubois@email.com",
    telephone: "06 12 34 56 78",
    etablissement: "Université de Paris",
    formation: "Master Informatique",
    status: "active",
    dateDebut: "01/03/2025",
    dateFin: "31/08/2025",
  },
  {
    id: "2",
    nom: "Martin",
    prenom: "Thomas",
    email: "thomas.martin@email.com",
    telephone: "07 23 45 67 89",
    etablissement: "École d'Ingénieurs de Lyon",
    formation: "Ingénierie des systèmes",
    status: "active",
    dateDebut: "15/02/2025",
    dateFin: "15/07/2025",
  },
  {
    id: "3",
    nom: "Bernard",
    prenom: "Lucie",
    email: "lucie.bernard@email.com",
    telephone: "06 34 56 78 90",
    etablissement: "HEC Paris",
    formation: "MBA Marketing Digital",
    status: "upcoming",
    dateDebut: "01/05/2025",
    dateFin: "31/10/2025",
  },
  {
    id: "4",
    nom: "Petit",
    prenom: "Antoine",
    email: "antoine.petit@email.com",
    telephone: "07 45 67 89 01",
    etablissement: "Sciences Po Bordeaux",
    formation: "Master Relations Internationales",
    status: "completed",
    dateDebut: "01/09/2024",
    dateFin: "28/02/2025",
  },
  {
    id: "5",
    nom: "Durand",
    prenom: "Sophie",
    email: "sophie.durand@email.com",
    telephone: "06 56 78 90 12",
    etablissement: "ESCP Business School",
    formation: "Finance d'entreprise",
    status: "active",
    dateDebut: "15/01/2025",
    dateFin: "15/06/2025",
  },
  {
    id: "6",
    nom: "Leroy",
    prenom: "Maxime",
    email: "maxime.leroy@email.com",
    telephone: "07 67 89 01 23",
    etablissement: "Ecole 42",
    formation: "Développement informatique",
    status: "upcoming",
    dateDebut: "01/06/2025",
    dateFin: "30/11/2025",
  },
];

const Stagiaires = () => {
  const [stagiaires, setStagiaires] = useState<StagiaireType[]>(MOCK_STAGIAIRES);
  const [activeTab, setActiveTab] = useState<string>("all");
  const { toast } = useToast();
  
  const filteredStagiaires = stagiaires.filter(stagiaire => {
    if (activeTab === "all") return true;
    return stagiaire.status === activeTab;
  });
  
  const handleViewStagiaire = (id: string) => {
    toast({
      title: "Détails du stagiaire",
      description: `Affichage des détails du stagiaire ID: ${id}`,
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
              <h1 className="text-3xl font-bold">Stagiaires</h1>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau stagiaire
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
                  <TabsTrigger value="all">Tous</TabsTrigger>
                  <TabsTrigger value="active">En cours</TabsTrigger>
                  <TabsTrigger value="upcoming">À venir</TabsTrigger>
                  <TabsTrigger value="completed">Terminés</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex w-full sm:w-auto gap-2">
                <Input
                  placeholder="Rechercher un stagiaire..."
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
                    <SelectItem value="formation">Formation</SelectItem>
                    <SelectItem value="etablissement">Établissement</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStagiaires.map((stagiaire) => (
                <StagiaireCard
                  key={stagiaire.id}
                  stagiaire={stagiaire}
                  onView={handleViewStagiaire}
                />
              ))}
              
              {filteredStagiaires.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                    <GraduationCap className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-lg mb-1">Aucun stagiaire trouvé</h3>
                  <p className="text-muted-foreground mb-4">
                    Aucun stagiaire ne correspond à vos filtres.
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

export default Stagiaires;

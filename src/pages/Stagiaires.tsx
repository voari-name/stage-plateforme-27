
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { StagiaireCard, StagiaireType } from "@/components/stagiaires/StagiaireCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { GraduationCap, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StagiaireForm } from "@/components/stagiaires/StagiaireForm";
import { format } from "date-fns";
import { addNotification } from "@/utils/notificationUtils";
import { Banner } from "@/components/layout/Banner";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Données de démonstration utilisées en mode hors-ligne
const demoStagiaires: StagiaireType[] = [
  {
    id: '1',
    nom: 'RAKOTO',
    prenom: 'Jean',
    email: 'jean.rakoto@example.com',
    telephone: '034 00 123 45',
    etablissement: 'Université d\'Antananarivo',
    formation: 'Informatique',
    status: 'active',
    dateDebut: '01/05/2023',
    dateFin: '30/07/2023',
    intitule: 'Stage de fin d\'études',
    avatar: ''
  },
  {
    id: '2',
    nom: 'RASOA',
    prenom: 'Marie',
    email: 'marie.rasoa@example.com',
    telephone: '033 45 678 90',
    etablissement: 'ESTI',
    formation: 'Développement Web',
    status: 'upcoming',
    dateDebut: '15/06/2023',
    dateFin: '15/09/2023',
    intitule: 'Stage d\'initiation',
    avatar: ''
  },
  {
    id: '3',
    nom: 'RABE',
    prenom: 'Pierre',
    email: 'pierre.rabe@example.com',
    telephone: '032 10 293 84',
    etablissement: 'IT University',
    formation: 'Réseaux et systèmes',
    status: 'completed',
    dateDebut: '01/01/2023',
    dateFin: '31/03/2023',
    intitule: 'Stage de perfectionnement',
    avatar: ''
  }
];

const Stagiaires = () => {
  const [stagiaires, setStagiaires] = useState<StagiaireType[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stagiaireToDelete, setStagiaireToDelete] = useState<string | null>(null);
  const [stagiaireToEdit, setStagiaireToEdit] = useState<StagiaireType | null>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [offline, setOffline] = useState<boolean>(false);
  const [initialLoadDone, setInitialLoadDone] = useState<boolean>(false);

  useEffect(() => {
    fetchStagiaires();
    // eslint-disable-next-line
  }, []);

  const fetchStagiaires = async () => {
    setLoading(true);
    try {
      // Récupérer les données du localStorage pour le mode hors-ligne
      const cachedStagiaires = localStorage.getItem('stagiaires');
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/stagiaires`, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || ''
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des stagiaires');
      }
      
      const data = await response.json();
      
      const formattedStagiaires = data.map((row: any) => ({
        id: row._id || row.id || row.uuid || row.idstagiaire || row.email, // fallback
        nom: row.nom,
        prenom: row.prenom,
        email: row.email,
        telephone: row.telephone,
        etablissement: row.etablissement,
        formation: row.formation,
        status: row.status || 'active',
        dateDebut: row.dateDebut,
        dateFin: row.dateFin,
        intitule: row.intitule,
        avatar: row.avatar || '',
      }));

      setStagiaires(formattedStagiaires);
      setOffline(false);
      
      // Mettre en cache les données pour le mode hors-ligne
      localStorage.setItem('stagiaires', JSON.stringify(formattedStagiaires));
      
    } catch (error) {
      console.error("Erreur fetchStagiaires:", error);
      
      // En cas d'erreur, charger les données du cache ou les données de démo
      const cachedStagiaires = localStorage.getItem('stagiaires');
      
      if (cachedStagiaires) {
        setStagiaires(JSON.parse(cachedStagiaires));
        toast({ 
          title: "Mode hors-ligne", 
          description: "Affichage des stagiaires depuis le cache local" 
        });
      } else {
        // Utiliser les données de démonstration si aucun cache n'est disponible
        setStagiaires(demoStagiaires);
        toast({ 
          title: "Mode démo", 
          description: "Affichage des stagiaires de démonstration" 
        });
      }
      
      setOffline(true);
    } finally {
      setLoading(false);
      setInitialLoadDone(true);
    }
  };

  const handleAddStagiaire = async (values: any) => {
    try {
      if (offline) {
        // Mode hors ligne: ajouter localement
        const newStagiaire: StagiaireType = {
          id: `local-${Date.now()}`,
          nom: values.nom,
          prenom: values.prenom,
          email: values.email,
          telephone: values.telephone,
          etablissement: values.etablissement,
          formation: values.formation,
          status: values.status,
          dateDebut: format(values.dateDebut, "dd/MM/yyyy"),
          dateFin: format(values.dateFin, "dd/MM/yyyy"),
          intitule: values.intitule,
          avatar: values.avatar || '',
        };
        
        const updatedStagiaires = [...stagiaires, newStagiaire];
        setStagiaires(updatedStagiaires);
        localStorage.setItem('stagiaires', JSON.stringify(updatedStagiaires));
        
        setDrawerOpen(false);
        addNotification(
          "Nouveau stagiaire ajouté (mode hors-ligne)",
          `${values.prenom} ${values.nom} a été ajouté en local`
        );
        toast({ 
          title: "Stagiaire ajouté", 
          description: `${values.prenom} ${values.nom} a été ajouté en local` 
        });
        return;
      }
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/stagiaires`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || ''
        },
        body: JSON.stringify({
          nom: values.nom,
          prenom: values.prenom,
          email: values.email,
          telephone: values.telephone,
          etablissement: values.etablissement,
          formation: values.formation,
          status: values.status,
          dateDebut: format(values.dateDebut, "dd/MM/yyyy"),
          dateFin: format(values.dateFin, "dd/MM/yyyy"),
          intitule: values.intitule,
          avatar: values.avatar || null,
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du stagiaire');
      }

      const data = await response.json();
      
      setDrawerOpen(false);
      addNotification(
        "Nouveau stagiaire ajouté",
        `${values.prenom} ${values.nom} a été ajouté avec succès`
      );
      toast({ title: "Stagiaire ajouté", description: `${values.prenom} ${values.nom} a été ajouté avec succès` });
      await fetchStagiaires();
    } catch (error) {
      console.error("Erreur handleAddStagiaire:", error);
      toast({ title: "Erreur", description: "Une erreur s'est produite lors de l'ajout", variant: "destructive" });
    }
  };

  const handleEditStagiaire = async (values: any) => {
    if (!stagiaireToEdit) return;
    
    try {
      if (offline) {
        // Mode hors ligne: modifier localement
        const updatedStagiaires = stagiaires.map(s => {
          if (s.id === stagiaireToEdit.id) {
            return {
              ...s,
              nom: values.nom,
              prenom: values.prenom,
              email: values.email,
              telephone: values.telephone,
              etablissement: values.etablissement,
              formation: values.formation,
              status: values.status,
              dateDebut: format(values.dateDebut, "dd/MM/yyyy"),
              dateFin: format(values.dateFin, "dd/MM/yyyy"),
              intitule: values.intitule,
              avatar: values.avatar || s.avatar,
            };
          }
          return s;
        });
        
        setStagiaires(updatedStagiaires);
        localStorage.setItem('stagiaires', JSON.stringify(updatedStagiaires));
        
        setDrawerOpen(false);
        setStagiaireToEdit(null);
        addNotification(
          "Stagiaire modifié (mode hors-ligne)",
          `Les informations de ${values.prenom} ${values.nom} ont été mises à jour en local`
        );
        toast({ 
          title: "Stagiaire modifié", 
          description: `Les informations de ${values.prenom} ${values.nom} ont été mises à jour en local` 
        });
        return;
      }
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/stagiaires/${stagiaireToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || ''
        },
        body: JSON.stringify({
          nom: values.nom,
          prenom: values.prenom,
          email: values.email,
          telephone: values.telephone,
          etablissement: values.etablissement,
          formation: values.formation,
          status: values.status,
          dateDebut: format(values.dateDebut, "dd/MM/yyyy"),
          dateFin: format(values.dateFin, "dd/MM/yyyy"),
          intitule: values.intitule,
          avatar: values.avatar || null,
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la modification du stagiaire');
      }
      
      setDrawerOpen(false);
      setStagiaireToEdit(null);
      addNotification(
        "Stagiaire modifié",
        `Les informations de ${values.prenom} ${values.nom} ont été mises à jour`
      );
      toast({ title: "Stagiaire modifié", description: `Les informations de ${values.prenom} ${values.nom} ont été mises à jour` });
      await fetchStagiaires();
    } catch (error) {
      console.error("Erreur handleEditStagiaire:", error);
      toast({ title: "Erreur", description: "Une erreur s'est produite lors de la modification", variant: "destructive" });
    }
  };

  const handleDeleteStagiaire = async () => {
    if (!stagiaireToDelete) return;
    let stagiaireToRemove = stagiaires.find(s => s.id === stagiaireToDelete);
    
    try {
      if (offline) {
        // Mode hors ligne: supprimer localement
        const updatedStagiaires = stagiaires.filter(s => s.id !== stagiaireToDelete);
        setStagiaires(updatedStagiaires);
        localStorage.setItem('stagiaires', JSON.stringify(updatedStagiaires));
        
        setStagiaireToDelete(null);
        toast({ 
          title: "Stagiaire supprimé", 
          description: "Le stagiaire a été supprimé localement" 
        });
        if (stagiaireToRemove) {
          addNotification(
            "Stagiaire supprimé (mode hors-ligne)",
            `${stagiaireToRemove.prenom} ${stagiaireToRemove.nom} a été supprimé en local`
          );
        }
        return;
      }
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/stagiaires/${stagiaireToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || ''
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du stagiaire');
      }
      
      setStagiaireToDelete(null);
      toast({ title: "Stagiaire supprimé", description: "Le stagiaire a été supprimé avec succès" });
      if (stagiaireToRemove) {
        addNotification(
          "Stagiaire supprimé",
          `${stagiaireToRemove.prenom} ${stagiaireToRemove.nom} a été supprimé`
        );
      }
      await fetchStagiaires();
    } catch (error) {
      console.error("Erreur handleDeleteStagiaire:", error);
      toast({ title: "Erreur", description: "Erreur lors de la suppression", variant: "destructive" });
    }
  };

  const handleViewStagiaire = (id: string) => {
    const stagiaire = stagiaires.find(s => s.id === id);
    setStagiaireToEdit(stagiaire || null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setStagiaireToEdit(null);
  };

  const filteredStagiaires = stagiaires.filter(stagiaire => {
    const statusMatch = activeTab === "all" || stagiaire.status === activeTab;
    const searchMatch =
      searchTerm === "" ||
      `${stagiaire.prenom} ${stagiaire.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stagiaire.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stagiaire.formation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stagiaire.etablissement.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 dark:text-white">
          <div className="mx-auto max-w-7xl">
            {offline && initialLoadDone && (
              <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md shadow">
                <p className="font-medium">Mode hors-ligne actif</p>
                <p className="text-sm">Les modifications seront sauvegardées localement</p>
              </div>
            )}

            <div className="flex flex-col gap-4 mb-6">
              <Banner className="mb-2" />
              
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-300">Stagiaires</h1>
                <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                  <DrawerTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300">
                      <Plus className="h-4 w-4 mr-2" />
                      Nouveau stagiaire
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="dark:bg-slate-800">
                    <div className="mx-auto w-full max-w-3xl">
                      <DrawerHeader className="text-left">
                        <DrawerTitle>{stagiaireToEdit ? "Modifier un stagiaire" : "Ajouter un stagiaire"}</DrawerTitle>
                        <DrawerDescription>
                          {stagiaireToEdit
                            ? "Modifiez les informations du stagiaire ci-dessous."
                            : "Remplissez le formulaire ci-dessous pour ajouter un nouveau stagiaire."}
                        </DrawerDescription>
                      </DrawerHeader>
                      <div className="p-4">
                        <StagiaireForm
                          onSubmit={stagiaireToEdit ? handleEditStagiaire : handleAddStagiaire}
                          onCancel={handleCloseDrawer}
                          initialValues={stagiaireToEdit || undefined}
                          isEdit={!!stagiaireToEdit}
                        />
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
                  <TabsTrigger value="all">Tous</TabsTrigger>
                  <TabsTrigger value="active">En cours</TabsTrigger>
                  <TabsTrigger value="upcoming">À venir</TabsTrigger>
                  <TabsTrigger value="completed">Terminés</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex w-full sm:w-auto">
                <Input
                  placeholder="Rechercher un stagiaire..."
                  className="w-full sm:w-[250px] bg-white/80 dark:bg-slate-700/80 border-blue-200 dark:border-blue-900"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full flex items-center justify-center py-20">
                  <span className="text-blue-600 font-semibold">Chargement...</span>
                </div>
              ) : filteredStagiaires.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center bg-white/50 backdrop-blur-sm rounded-xl shadow-md dark:bg-slate-800/50 dark:text-white">
                  <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                    <GraduationCap className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-medium text-xl mb-2 text-blue-800 dark:text-blue-300">Aucun stagiaire trouvé</h3>
                  <p className="text-muted-foreground dark:text-gray-400 mb-6 max-w-md">
                    {stagiaires.length === 0
                      ? 'Ajoutez votre premier stagiaire en cliquant sur le bouton "Nouveau stagiaire".'
                      : "Aucun stagiaire ne correspond à vos filtres."}
                  </p>
                  {stagiaires.length > 0 && (
                    <Button variant="outline" onClick={() => {
                      setActiveTab("all");
                      setSearchTerm("");
                    }} className="dark:text-white dark:border-blue-700">
                      Réinitialiser les filtres
                    </Button>
                  )}
                </div>
              ) : (
                filteredStagiaires.map((stagiaire) => (
                  <StagiaireCard
                    key={stagiaire.id}
                    stagiaire={stagiaire}
                    onDelete={(id) => setStagiaireToDelete(id)}
                  />
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      <AlertDialog open={!!stagiaireToDelete} onOpenChange={(open) => {
        if (!open) setStagiaireToDelete(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement le stagiaire
              de la base de données.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStagiaire} className="bg-red-500 hover:bg-red-600">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Stagiaires;

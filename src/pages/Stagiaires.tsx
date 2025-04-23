
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
import { supabase } from "@/lib/supabase";

const Stagiaires = () => {
  const [stagiaires, setStagiaires] = useState<StagiaireType[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stagiaireToDelete, setStagiaireToDelete] = useState<string | null>(null);
  const [stagiaireToEdit, setStagiaireToEdit] = useState<StagiaireType | null>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchStagiaires();
    // eslint-disable-next-line
  }, []);

  const fetchStagiaires = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("stagiaires")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) {
      toast({ title: "Erreur", description: "Erreur lors du chargement des stagiaires", variant: "destructive" });
    } else if (data) {
      setStagiaires(
        data.map((row: any) => ({
          id: row.id || row._id || row.uuid || row.idstagiaire || row.email, // fallback
          nom: row.nom,
          prenom: row.prenom,
          email: row.email,
          telephone: row.telephone,
          etablissement: row.etablissement,
          formation: row.formation,
          status: row.status,
          dateDebut: row.dateDebut,
          dateFin: row.dateFin,
          intitule: row.intitule,
          avatar: row.avatar,
        }))
      );
    }
    setLoading(false);
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

  const handleAddStagiaire = async (values: any) => {
    try {
      let { data, error } = await supabase
        .from("stagiaires")
        .insert([
          {
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
          },
        ])
        .select("*")
        .single();
      if (error) {
        toast({ title: "Erreur", description: "Erreur lors de l'ajout", variant: "destructive" });
      } else {
        setDrawerOpen(false);
        addNotification(
          "Nouveau stagiaire ajouté",
          `${values.prenom} ${values.nom} a été ajouté avec succès`
        );
        toast({ title: "Stagiaire ajouté", description: `${values.prenom} ${values.nom} a été ajouté avec succès` });
        await fetchStagiaires();
      }
    } catch (error) {
      toast({ title: "Erreur", description: "Une erreur s'est produite lors de l'ajout", variant: "destructive" });
    }
  };

  const handleEditStagiaire = async (values: any) => {
    if (!stagiaireToEdit) return;
    try {
      const { error } = await supabase
        .from("stagiaires")
        .update({
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
        .eq("id", stagiaireToEdit.id);
      if (error) {
        toast({ title: "Erreur", description: "Erreur lors de la modification", variant: "destructive" });
      } else {
        setDrawerOpen(false);
        setStagiaireToEdit(null);
        addNotification(
          "Stagiaire modifié",
          `Les informations de ${values.prenom} ${values.nom} ont été mises à jour`
        );
        toast({ title: "Stagiaire modifié", description: `Les informations de ${values.prenom} ${values.nom} ont été mises à jour` });
        await fetchStagiaires();
      }
    } catch (error) {
      toast({ title: "Erreur", description: "Une erreur s'est produite lors de la modification", variant: "destructive" });
    }
  };

  const handleDeleteStagiaire = async () => {
    if (!stagiaireToDelete) return;
    let stagiaireToRemove = stagiaires.find(s => s.id === stagiaireToDelete);
    const { error } = await supabase.from("stagiaires").delete().eq("id", stagiaireToDelete);
    if (error) {
      toast({ title: "Erreur", description: "Erreur lors de la suppression", variant: "destructive" });
    } else {
      setStagiaireToDelete(null);
      toast({ title: "Stagiaire supprimé", description: "Le stagiaire a été supprimé avec succès" });
      if (stagiaireToRemove) {
        addNotification(
          "Stagiaire supprimé",
          `${stagiaireToRemove.prenom} ${stagiaireToRemove.nom} a été supprimé`
        );
      }
      await fetchStagiaires();
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

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 dark:text-white">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-6">
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

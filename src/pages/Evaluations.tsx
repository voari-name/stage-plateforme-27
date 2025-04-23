
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useToast } from "@/hooks/use-toast";
import { addNotification } from "@/utils/notificationUtils";
import { generatePDF } from "@/utils/pdfUtils";
import { EvaluationsHeader } from "@/components/evaluations/EvaluationsHeader";
import { EvaluationsTabs } from "@/components/evaluations/EvaluationsTabs";
import { EvaluationsList } from "@/components/evaluations/EvaluationsList";
import { DeleteEvaluationDialog } from "@/components/evaluations/DeleteEvaluationDialog";

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

    const dataForPDF = id ? evaluationsForPDF[0] : evaluationsForPDF;
    generatePDF(dataForPDF);

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
              <EvaluationsHeader
                onCreate={handleCreateEvaluation}
                onDownloadPDF={() => handleDownloadPDF()}
              />
              <EvaluationsTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
              <EvaluationsList
                evaluations={filteredEvaluations}
                onDelete={setEvaluationToDelete}
                onDownload={handleDownloadPDF}
              />
            </div>
          </div>
        </main>
      </div>
      <DeleteEvaluationDialog
        open={!!evaluationToDelete}
        onOpenChange={(open) => { if (!open) setEvaluationToDelete(null); }}
        onDelete={handleDeleteEvaluation}
      />
    </div>
  );
};

export default Evaluations;

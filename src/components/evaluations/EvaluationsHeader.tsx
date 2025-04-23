
import { Button } from "@/components/ui/button";
import { PlusCircle, FileDown, FilePenLine } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { EvaluationForm } from "@/components/evaluations/EvaluationForm";

type EvaluationsHeaderProps = {
  onCreate: (data: { nom: string; prenom: string; note: number; genre: "masculin" | "feminin"; }) => void;
  onDownloadPDF: () => void;
};

export function EvaluationsHeader({ onCreate, onDownloadPDF }: EvaluationsHeaderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  return (
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
                onSubmit={(data) => {
                  onCreate(data);
                  setShowForm(false);
                  setIsDialogOpen(false);
                }}
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
          onClick={onDownloadPDF}
        >
          <FileDown className="h-4 w-4 mr-2" />
          Télécharger PDF
        </Button>
      </div>
    </div>
  );
}


import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileDown, Trash2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

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

type EvaluationCardProps = {
  evaluation: Evaluation;
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
};

export function EvaluationCard({ evaluation, onDelete, onDownload }: EvaluationCardProps) {
  const getEvaluationStatusConfig = (status: "reviewed") => ({
    reviewed: { 
      label: "Évaluée", 
      className: "bg-success text-success-foreground",
      icon: <Eye className="h-4 w-4 mr-1" />
    }
  })[status];

  const statusConfig = getEvaluationStatusConfig(evaluation.status);

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-blue-200 dark:border-blue-900 dark:bg-slate-800">
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
      
      <CardFooter className="border-t border-blue-100 dark:border-blue-900 pt-4 flex flex-wrap justify-end gap-2">
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(evaluation.id)}
          className="text-xs flex items-center px-2 md:text-sm md:px-3"
        >
          <Trash2 className="h-3 w-3 md:h-4 md:w-4 mr-1" />
          Supprimer
        </Button>
        <Button
          size="sm"
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-xs flex items-center px-2 md:text-sm md:px-3"
          onClick={() => onDownload(evaluation.id)}
        >
          <FileDown className="h-3 w-3 md:h-4 md:w-4 mr-1" />
          Télécharger PDF
        </Button>
      </CardFooter>
    </Card>
  );
}

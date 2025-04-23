
import { EvaluationCard } from "@/components/evaluations/EvaluationCard";
import { EmptyState } from "@/components/evaluations/EmptyState";

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

type EvaluationsListProps = {
  evaluations: Evaluation[];
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
  isLoading?: boolean;
};

export function EvaluationsList({ evaluations, onDelete, onDownload, isLoading = false }: EvaluationsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className="w-full h-40 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }
  
  if (evaluations.length === 0) {
    return <EmptyState />;
  }
  
  return (
    <div className="space-y-4">
      {evaluations.map(evaluation => (
        <EvaluationCard
          key={evaluation.id}
          evaluation={evaluation}
          onDelete={onDelete}
          onDownload={onDownload}
        />
      ))}
    </div>
  );
}

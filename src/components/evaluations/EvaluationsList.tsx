
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
};

export function EvaluationsList({ evaluations, onDelete, onDownload }: EvaluationsListProps) {
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

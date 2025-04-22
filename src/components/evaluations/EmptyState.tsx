
import { FileText } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center bg-white/50 backdrop-blur-sm rounded-xl shadow-md dark:bg-slate-800/50 dark:text-white">
      <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
        <FileText className="h-10 w-10 text-blue-600 dark:text-blue-300" />
      </div>
      <h3 className="font-medium text-lg mb-1">Aucune évaluation trouvée</h3>
      <p className="text-muted-foreground dark:text-gray-400 mb-4">
        Utilisez le formulaire pour créer une nouvelle évaluation.
      </p>
    </div>
  );
}

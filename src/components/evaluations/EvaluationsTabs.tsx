
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type EvaluationsTabsProps = {
  activeTab: string;
  onTabChange: (value: string) => void;
};

export function EvaluationsTabs({ activeTab, onTabChange }: EvaluationsTabsProps) {
  return (
    <div className="mb-6">
      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={onTabChange}
        className="w-full"
      >
        <TabsList className="bg-white/50 backdrop-blur-sm dark:bg-slate-800/50 w-full md:w-auto">
          <TabsTrigger value="all" className="flex-1 md:flex-none">Toutes</TabsTrigger>
          <TabsTrigger value="reviewed" className="flex-1 md:flex-none">Évaluées</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}

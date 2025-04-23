
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
        <TabsList className="bg-white/50 backdrop-blur-sm dark:bg-slate-800/50 w-full grid grid-cols-2 md:w-auto md:flex">
          <TabsTrigger value="all" className="px-4 py-2">Toutes</TabsTrigger>
          <TabsTrigger value="reviewed" className="px-4 py-2">Évaluées</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}

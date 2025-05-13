
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

interface MissionsFiltersProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filterType: string;
  setFilterType: (value: string) => void;
  language: string;
}

export const MissionsFilters = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  language
}: MissionsFiltersProps) => {
  const getSearchPlaceholder = () => {
    switch(language) {
      case "fr": return "Rechercher par titre, description...";
      case "en": return "Search by title, description...";
      case "mg": return "Hikaroka araka ny lohateny, fanazavana...";
      default: return "Rechercher par titre, description...";
    }
  };

  const getTabLabel = (status: string) => {
    if (status === "all") {
      return language === "fr" ? "Tous" : 
             language === "en" ? "All" : 
             "Rehetra";
    } else if (status === "not_started") {
      return language === "fr" ? "Non commencées" : 
             language === "en" ? "Not started" : 
             "Tsy nanomboka";
    } else if (status === "in_progress") {
      return language === "fr" ? "En cours" : 
             language === "en" ? "In progress" : 
             "Eo am-panatanterahana";
    } else if (status === "completed") {
      return language === "fr" ? "Terminées" : 
             language === "en" ? "Completed" : 
             "Vita";
    }
    return status;
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          placeholder={getSearchPlaceholder()}
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="all">{getTabLabel("all")}</TabsTrigger>
          <TabsTrigger value="not_started">{getTabLabel("not_started")}</TabsTrigger>
          <TabsTrigger value="in_progress">{getTabLabel("in_progress")}</TabsTrigger>
          <TabsTrigger value="completed">{getTabLabel("completed")}</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

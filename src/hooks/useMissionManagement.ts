
import { useState, useEffect } from "react";
import { MissionType } from "@/components/missions/MissionCard";
import { MissionFormValues } from "@/components/missions/form/MissionFormSchema";
import { Stagiaire } from "@/components/missions/MissionCard";
import { useMissionApi } from "./useMissionApi";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/translations";

interface UseMissionManagementProps {
  language: string;
  allStagiaires: Stagiaire[];
}

export const useMissionManagement = ({ 
  language, 
  allStagiaires 
}: UseMissionManagementProps) => {
  const { t } = useTranslation(language);
  const [missions, setMissions] = useState<MissionType[]>([]);
  const [currentMission, setCurrentMission] = useState<MissionType | undefined>();
  const { toast } = useToast();
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  
  // Filter states
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  
  // API integration
  const { 
    loading, 
    getMissions, 
    createMission, 
    updateMission, 
    assignStagiaires 
  } = useMissionApi({ language });

  // Load missions when component mounts
  useEffect(() => {
    const loadMissions = async () => {
      const fetchedMissions = await getMissions();
      setMissions(fetchedMissions);
    };
    
    loadMissions();
  }, [getMissions]);
  
  // Get filtered missions based on active tab and search query
  const getFilteredMissions = () => {
    return missions.filter((mission) => {
      // Filter by tab
      if (activeTab !== "all" && mission.status !== activeTab) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          mission.titre.toLowerCase().includes(query) ||
          mission.description.toLowerCase().includes(query) ||
          mission.departement.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  };
  
  // Reset all filters
  const resetFilters = () => {
    setActiveTab("all");
    setSearchQuery("");
    setFilterType("");
  };
  
  // Handle mission creation
  const handleCreateMission = async (values: MissionFormValues) => {
    const result = await createMission(values);
    if (result) {
      setMissions(prev => [result, ...prev]);
      
      toast({
        title: language === "fr" ? "Mission créée" : 
               language === "en" ? "Mission created" : 
               "Iraka noforonina",
        description: language === "fr" ? "La nouvelle mission a été créée avec succès" : 
                     language === "en" ? "The new mission has been successfully created" : 
                     "Nahomby ny famoronana ny iraka vaovao",
      });
    }
  };
  
  // Handle mission update
  const handleUpdateMission = async (values: MissionFormValues) => {
    if (!currentMission) return;
    
    const result = await updateMission(currentMission.id, values);
    if (result) {
      setMissions(missions.map(mission => 
        mission.id === currentMission.id ? result : mission
      ));
      
      toast({
        title: language === "fr" ? "Mission mise à jour" : 
               language === "en" ? "Mission updated" : 
               "Iraka nohavaozina",
        description: language === "fr" ? "La mission a été mise à jour avec succès" : 
                     language === "en" ? "The mission has been successfully updated" : 
                     "Nahomby ny fanavaozana ny iraka",
      });
    }
  };
  
  // View mission details (opens edit dialog)
  const handleViewDetails = (id: string) => {
    const mission = missions.find(m => m.id === id);
    if (mission) {
      setCurrentMission(mission);
      setEditDialogOpen(true);
    }
  };
  
  // Open assign stagiaires dialog
  const handleOpenAssignDialog = (id: string) => {
    const mission = missions.find(m => m.id === id);
    if (mission) {
      setCurrentMission(mission);
      setAssignDialogOpen(true);
    }
  };
  
  // Handle stagiaire assignment
  const handleAssignStagiaires = async (missionId: string, stagiaireIds: string[]) => {
    const success = await assignStagiaires(missionId, stagiaireIds);
    
    if (success) {
      // Find selected stagiaires from the mock data
      const selectedStagiaires = allStagiaires.filter(s => stagiaireIds.includes(s.id));
      
      // Update the mission with the new stagiaires
      setMissions(missions.map(mission => 
        mission.id === missionId
          ? { ...mission, stagiaires: selectedStagiaires }
          : mission
      ));
      
      toast({
        title: language === "fr" ? "Stagiaires assignés" : 
               language === "en" ? "Trainees assigned" : 
               "Mpianatra voatokana",
        description: language === "fr" ? "Les stagiaires ont été assignés à la mission avec succès" : 
                     language === "en" ? "Trainees have been successfully assigned to the mission" : 
                     "Nahomby ny fanendrena ireo mpianatra ho amin'ny iraka",
      });
    }
  };
  
  return {
    missions,
    currentMission,
    loading,
    filteredMissions: getFilteredMissions(),
    
    // Dialog states
    createDialogOpen,
    setCreateDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    assignDialogOpen,
    setAssignDialogOpen,
    
    // Filter states
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    resetFilters,
    
    // Actions
    handleCreateMission,
    handleUpdateMission,
    handleViewDetails,
    handleOpenAssignDialog,
    handleAssignStagiaires,
  };
};

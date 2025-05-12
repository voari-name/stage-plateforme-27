
import { useState } from "react";
import { MissionType } from "@/components/missions/MissionCard";
import { MissionFormValues } from "@/components/missions/MissionForm";
import { formatDate } from "@/components/missions/utils";
import { Stagiaire } from "@/components/missions/MissionCard";

interface UseMissionManagementProps {
  initialMissions: MissionType[];
  allStagiaires: Stagiaire[];
}

export const useMissionManagement = ({ 
  initialMissions, 
  allStagiaires 
}: UseMissionManagementProps) => {
  const [missions, setMissions] = useState<MissionType[]>(initialMissions);
  const [currentMission, setCurrentMission] = useState<MissionType | undefined>();
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  
  // Filter states
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  
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
  const handleCreateMission = (values: MissionFormValues) => {
    const newMission: MissionType = {
      id: `mission-${Date.now()}`,
      titre: values.titre,
      description: values.description,
      status: values.status,
      dateDebut: values.dateDebut ? formatDate(values.dateDebut) : "",
      dateFin: values.dateFin ? formatDate(values.dateFin) : "",
      progress: values.progress || 0,
      departement: values.departement,
      stagiaires: []
    };
    
    setMissions([newMission, ...missions]);
  };
  
  // Handle mission update
  const handleUpdateMission = (values: MissionFormValues) => {
    if (!currentMission) return;
    
    setMissions(missions.map(mission => 
      mission.id === currentMission.id
        ? {
            ...mission,
            titre: values.titre,
            description: values.description,
            status: values.status,
            dateDebut: values.dateDebut ? formatDate(values.dateDebut) : "",
            dateFin: values.dateFin ? formatDate(values.dateFin) : "",
            progress: values.progress || 0,
            departement: values.departement,
          }
        : mission
    ));
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
  const handleAssignStagiaires = (missionId: string, stagiaireIds: string[]) => {
    // Find selected stagiaires from the mock data
    const selectedStagiaires = allStagiaires.filter(s => stagiaireIds.includes(s.id));
    
    // Update the mission with the new stagiaires
    setMissions(missions.map(mission => 
      mission.id === missionId
        ? { ...mission, stagiaires: selectedStagiaires }
        : mission
    ));
  };
  
  return {
    missions,
    currentMission,
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

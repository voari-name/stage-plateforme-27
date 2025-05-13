
import { Layout } from "@/components/layout/Layout";
import { Header } from "@/components/layout/Header";
import { MissionsHeader } from "@/components/missions/MissionsHeader";
import { MissionsFilters } from "@/components/missions/MissionsFilters";
import { MissionsList } from "@/components/missions/MissionsList";
import { MissionsEmptyState } from "@/components/missions/MissionsEmptyState";
import { MissionDialog } from "@/components/missions/MissionDialog";
import { AssignStagiairesDialog } from "@/components/missions/AssignStagiairesDialog";
import { useMissionManagement } from "@/hooks/useMissionManagement";
import { MOCK_STAGIAIRES } from "@/data/missionsData";
import { useTheme } from "@/components/ThemeProvider";

const Missions = () => {
  const { language } = useTheme();
  
  const {
    currentMission,
    filteredMissions,
    loading,
    
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
  } = useMissionManagement({
    language,
    allStagiaires: MOCK_STAGIAIRES,
  });
  
  return (
    <div className="flex h-screen bg-background">
      <Layout>
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">
            <MissionsHeader 
              onCreateMission={() => setCreateDialogOpen(true)} 
              language={language}
            />
            
            <MissionsFilters
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterType={filterType}
              setFilterType={setFilterType}
              language={language}
            />
            
            {loading ? (
              <div className="flex justify-center items-center p-12">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredMissions.length > 0 ? (
              <MissionsList 
                missions={filteredMissions}
                onViewDetails={handleViewDetails}
                onAssign={handleOpenAssignDialog}
                language={language}
              />
            ) : (
              <MissionsEmptyState 
                resetFilters={resetFilters}
                language={language}
              />
            )}
          </div>
        </main>
        
        {/* Create Mission Dialog */}
        <MissionDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSubmit={handleCreateMission}
          title={
            language === "fr" ? "Créer une nouvelle mission" :
            language === "en" ? "Create a new mission" :
            "Mamorona iraka vaovao"
          }
          language={language}
        />
        
        {/* Edit Mission Dialog */}
        <MissionDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSubmit={handleUpdateMission}
          mission={currentMission}
          title={
            language === "fr" ? "Modifier la mission" :
            language === "en" ? "Edit mission" :
            "Hanova ny iraka"
          }
          language={language}
        />
        
        {/* Assign Stagiaires Dialog */}
        <AssignStagiairesDialog
          open={assignDialogOpen}
          onOpenChange={setAssignDialogOpen}
          mission={currentMission}
          stagiaires={MOCK_STAGIAIRES}
          onAssign={handleAssignStagiaires}
          language={language}
        />
      </Layout>
    </div>
  );
};

export default Missions;

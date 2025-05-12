
import { Layout } from "@/components/layout/Layout";
import { Header } from "@/components/layout/Header";
import { MissionsHeader } from "@/components/missions/MissionsHeader";
import { MissionsFilters } from "@/components/missions/MissionsFilters";
import { MissionsList } from "@/components/missions/MissionsList";
import { MissionsEmptyState } from "@/components/missions/MissionsEmptyState";
import { MissionDialog } from "@/components/missions/MissionDialog";
import { AssignStagiairesDialog } from "@/components/missions/AssignStagiairesDialog";
import { useMissionManagement } from "@/hooks/useMissionManagement";
import { MOCK_MISSIONS, MOCK_STAGIAIRES } from "@/data/missionsData";

const Missions = () => {
  const {
    currentMission,
    filteredMissions,
    
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
    initialMissions: MOCK_MISSIONS,
    allStagiaires: MOCK_STAGIAIRES,
  });
  
  return (
    <div className="flex h-screen bg-background">
      <Layout>
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">
            <MissionsHeader onCreateMission={() => setCreateDialogOpen(true)} />
            
            <MissionsFilters
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterType={filterType}
              setFilterType={setFilterType}
            />
            
            {filteredMissions.length > 0 ? (
              <MissionsList 
                missions={filteredMissions}
                onViewDetails={handleViewDetails}
                onAssign={handleOpenAssignDialog}
              />
            ) : (
              <MissionsEmptyState resetFilters={resetFilters} />
            )}
          </div>
        </main>
        
        {/* Create Mission Dialog */}
        <MissionDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSubmit={handleCreateMission}
          title="Créer une nouvelle mission"
        />
        
        {/* Edit Mission Dialog */}
        <MissionDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSubmit={handleUpdateMission}
          mission={currentMission}
          title="Modifier la mission"
        />
        
        {/* Assign Stagiaires Dialog */}
        <AssignStagiairesDialog
          open={assignDialogOpen}
          onOpenChange={setAssignDialogOpen}
          mission={currentMission}
          stagiaires={MOCK_STAGIAIRES}
          onAssign={handleAssignStagiaires}
        />
      </Layout>
    </div>
  );
};

export default Missions;

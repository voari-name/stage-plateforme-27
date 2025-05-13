import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { MissionType } from "@/components/missions/MissionCard";
import { MissionFormValues } from "@/components/missions/form/MissionFormSchema";
import { formatDate } from "@/components/missions/utils";

interface UseMissionApiProps {
  language: string;
}

export const useMissionApi = ({ language }: UseMissionApiProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getErrorMessage = (err: any) => {
    return language === "fr" ? "Erreur lors de la récupération des missions" :
           language === "en" ? "Error fetching missions" :
           "Hadisoana tamin'ny fakana ny iraka";
  };

  const getMissions = async (): Promise<MissionType[]> => {
    setLoading(true);
    setError(null);
    
    try {
      // First try to fetch from the server
      try {
        const response = await fetch('http://localhost:5000/api/missions', {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': 'demo-token'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Map the server response to our frontend model
        return data.map((mission: any) => ({
          id: mission._id,
          titre: mission.titre,
          description: mission.description,
          status: mission.status,
          dateDebut: mission.dateDebut,
          dateFin: mission.dateFin,
          progress: mission.progress,
          departement: mission.departement,
          stagiaires: mission.stagiaires.map((s: any) => ({
            id: s._id,
            nom: s.nom,
            prenom: s.prenom,
            avatar: s.avatar
          }))
        }));
      } catch (err) {
        console.error("Server fetch failed, using mock data:", err);
        // Fallback to local storage or mock data if server is not available
        const storedMissions = localStorage.getItem('missions');
        if (storedMissions) {
          return JSON.parse(storedMissions);
        }
        
        // Use mock data as final fallback
        const { MOCK_MISSIONS } = await import('@/data/missionsData');
        return MOCK_MISSIONS;
      }
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      toast({
        variant: "destructive",
        title: errorMsg,
        description: err instanceof Error ? err.message : String(err),
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createMission = async (values: MissionFormValues): Promise<MissionType | null> => {
    setLoading(true);
    setError(null);
    
    const newMission = {
      titre: values.titre,
      description: values.description,
      status: values.status,
      dateDebut: values.dateDebut ? formatDate(values.dateDebut) : "",
      dateFin: values.dateFin ? formatDate(values.dateFin) : "",
      progress: values.progress || 0,
      departement: values.departement,
      stagiaires: []
    };
    
    try {
      try {
        const response = await fetch('http://localhost:5000/api/missions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': 'demo-token'
          },
          body: JSON.stringify(newMission)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Return the created mission with proper types
        const createdMission: MissionType = {
          id: data._id,
          titre: data.titre,
          description: data.description,
          status: data.status,
          dateDebut: data.dateDebut,
          dateFin: data.dateFin,
          progress: data.progress,
          departement: data.departement,
          stagiaires: data.stagiaires.map((s: any) => ({
            id: s._id,
            nom: s.nom,
            prenom: s.prenom,
            avatar: s.avatar
          }))
        };
        
        // Update local storage for offline fallback
        const storedMissions = localStorage.getItem('missions');
        const missions = storedMissions ? JSON.parse(storedMissions) : [];
        localStorage.setItem('missions', JSON.stringify([createdMission, ...missions]));
        
        return createdMission;
      } catch (err) {
        console.error("Server create failed, using local storage:", err);
        
        // Fallback to local storage
        const mockId = `mission-${Date.now()}`;
        const mockMission: MissionType = {
          id: mockId,
          ...newMission
        };
        
        // Save to local storage for offline access
        const storedMissions = localStorage.getItem('missions');
        const missions = storedMissions ? JSON.parse(storedMissions) : [];
        localStorage.setItem('missions', JSON.stringify([mockMission, ...missions]));
        
        return mockMission;
      }
    } catch (err) {
      const errorMsg = language === "fr" ? "Erreur lors de la création de la mission" :
                       language === "en" ? "Error creating mission" :
                       "Hadisoana tamin'ny famoronana ny iraka";
      setError(errorMsg);
      toast({
        variant: "destructive",
        title: errorMsg,
        description: err instanceof Error ? err.message : String(err),
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateMission = async (id: string, values: MissionFormValues): Promise<MissionType | null> => {
    setLoading(true);
    setError(null);
    
    const updatedData = {
      titre: values.titre,
      description: values.description,
      status: values.status,
      dateDebut: values.dateDebut ? formatDate(values.dateDebut) : "",
      dateFin: values.dateFin ? formatDate(values.dateFin) : "",
      progress: values.progress || 0,
      departement: values.departement
    };
    
    try {
      try {
        const response = await fetch(`http://localhost:5000/api/missions/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': 'demo-token'
          },
          body: JSON.stringify(updatedData)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Return the updated mission with proper types
        const updatedMission: MissionType = {
          id: data._id,
          titre: data.titre,
          description: data.description,
          status: data.status,
          dateDebut: data.dateDebut,
          dateFin: data.dateFin,
          progress: data.progress,
          departement: data.departement,
          stagiaires: data.stagiaires.map((s: any) => ({
            id: s._id,
            nom: s.nom,
            prenom: s.prenom,
            avatar: s.avatar
          }))
        };
        
        // Update local storage for offline fallback
        const storedMissions = localStorage.getItem('missions');
        if (storedMissions) {
          const missions = JSON.parse(storedMissions);
          const updatedMissions = missions.map((m: MissionType) => 
            m.id === id ? { ...m, ...updatedData } : m
          );
          localStorage.setItem('missions', JSON.stringify(updatedMissions));
        }
        
        return updatedMission;
      } catch (err) {
        console.error("Server update failed, using local storage:", err);
        
        // Fallback to local storage
        const storedMissions = localStorage.getItem('missions');
        if (storedMissions) {
          const missions = JSON.parse(storedMissions);
          const updatedMissions = missions.map((m: MissionType) => 
            m.id === id ? { ...m, ...updatedData } : m
          );
          localStorage.setItem('missions', JSON.stringify(updatedMissions));
          
          return updatedMissions.find((m: MissionType) => m.id === id) || null;
        }
        return null;
      }
    } catch (err) {
      const errorMsg = language === "fr" ? "Erreur lors de la mise à jour de la mission" :
                       language === "en" ? "Error updating mission" :
                       "Hadisoana tamin'ny fanavaozana ny iraka";
      setError(errorMsg);
      toast({
        variant: "destructive",
        title: errorMsg,
        description: err instanceof Error ? err.message : String(err),
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const assignStagiaires = async (missionId: string, stagiaireIds: string[]): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      try {
        const response = await fetch(`http://localhost:5000/api/missions/${missionId}/assign`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': 'demo-token'
          },
          body: JSON.stringify({ stagiaires: stagiaireIds })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        await response.json();
        
        // Update local storage
        const storedMissions = localStorage.getItem('missions');
        if (storedMissions) {
          const missions = JSON.parse(storedMissions);
          // Get stagiaires details from another mission or mock data to maintain data structure
          let stagiairesDetails: any[] = [];
          
          // Find stagiaires from existing missions or from mock data
          const { MOCK_STAGIAIRES } = await import('@/data/missionsData');
          stagiairesDetails = MOCK_STAGIAIRES.filter(s => stagiaireIds.includes(s.id));
          
          const updatedMissions = missions.map((m: MissionType) => 
            m.id === missionId ? { ...m, stagiaires: stagiairesDetails } : m
          );
          localStorage.setItem('missions', JSON.stringify(updatedMissions));
        }
        
        return true;
      } catch (err) {
        console.error("Server assign failed, using local storage:", err);
        
        // Fallback to local storage
        const storedMissions = localStorage.getItem('missions');
        if (storedMissions) {
          const missions = JSON.parse(storedMissions);
          
          // Get stagiaires details from mock data
          const { MOCK_STAGIAIRES } = await import('@/data/missionsData');
          const stagiairesDetails = MOCK_STAGIAIRES.filter(s => stagiaireIds.includes(s.id));
          
          const updatedMissions = missions.map((m: MissionType) => 
            m.id === missionId ? { ...m, stagiaires: stagiairesDetails } : m
          );
          localStorage.setItem('missions', JSON.stringify(updatedMissions));
        }
        
        return true;
      }
    } catch (err) {
      const errorMsg = language === "fr" ? "Erreur lors de l'assignation des stagiaires" :
                       language === "en" ? "Error assigning trainees" :
                       "Hadisoana tamin'ny fanomezana ny mpianatra";
      setError(errorMsg);
      toast({
        variant: "destructive",
        title: errorMsg,
        description: err instanceof Error ? err.message : String(err),
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteMission = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      try {
        const response = await fetch(`http://localhost:5000/api/missions/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': 'demo-token'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Update local storage for offline fallback
        const storedMissions = localStorage.getItem('missions');
        if (storedMissions) {
          const missions = JSON.parse(storedMissions);
          const filteredMissions = missions.filter((m: MissionType) => m.id !== id);
          localStorage.setItem('missions', JSON.stringify(filteredMissions));
        }
        
        return true;
      } catch (err) {
        console.error("Server delete failed, using local storage:", err);
        
        // Fallback to local storage
        const storedMissions = localStorage.getItem('missions');
        if (storedMissions) {
          const missions = JSON.parse(storedMissions);
          const filteredMissions = missions.filter((m: MissionType) => m.id !== id);
          localStorage.setItem('missions', JSON.stringify(filteredMissions));
        }
        
        return true;
      }
    } catch (err) {
      const errorMsg = language === "fr" ? "Erreur lors de la suppression de la mission" :
                       language === "en" ? "Error deleting mission" :
                       "Hadisoana tamin'ny famafana ny iraka";
      setError(errorMsg);
      toast({
        variant: "destructive",
        title: errorMsg,
        description: err instanceof Error ? err.message : String(err),
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getMissions,
    createMission,
    updateMission,
    deleteMission,
    assignStagiaires
  };
};


import { MissionType, Stagiaire } from "@/components/missions/MissionCard";

// Mock missions data
export const MOCK_MISSIONS: MissionType[] = [
  {
    id: "1",
    titre: "Refonte site web",
    description: "Modernisation du site internet de l'entreprise",
    status: "in_progress",
    dateDebut: "01/03/2025",
    dateFin: "30/04/2025",
    progress: 65,
    departement: "Informatique",
    stagiaires: [
      { id: "1", nom: "Dubois", prenom: "Marie" },
      { id: "2", nom: "Martin", prenom: "Thomas" },
    ],
  },
  {
    id: "2",
    titre: "Étude de marché",
    description: "Analyse concurrentielle pour nouveau produit",
    status: "not_started",
    dateDebut: "15/04/2025",
    dateFin: "15/05/2025",
    progress: 0,
    departement: "Marketing",
    stagiaires: [
      { id: "3", nom: "Bernard", prenom: "Lucie" },
    ],
  },
  {
    id: "3",
    titre: "Optimisation des processus RH",
    description: "Digitalisation du processus de recrutement",
    status: "completed",
    dateDebut: "01/01/2025",
    dateFin: "28/02/2025",
    progress: 100,
    departement: "Ressources Humaines",
    stagiaires: [
      { id: "4", nom: "Petit", prenom: "Antoine" },
      { id: "5", nom: "Durand", prenom: "Sophie" },
    ],
  },
  {
    id: "4",
    titre: "Développement application mobile",
    description: "Application client pour iOS et Android",
    status: "in_progress",
    dateDebut: "15/02/2025",
    dateFin: "30/05/2025",
    progress: 40,
    departement: "Informatique",
    stagiaires: [
      { id: "2", nom: "Martin", prenom: "Thomas" },
      { id: "6", nom: "Leroy", prenom: "Maxime" },
    ],
  },
  {
    id: "5",
    titre: "Analyse financière",
    description: "Audit des finances du premier trimestre",
    status: "not_started",
    dateDebut: "01/05/2025",
    dateFin: "31/05/2025",
    progress: 0,
    departement: "Finance",
    stagiaires: [
      { id: "5", nom: "Durand", prenom: "Sophie" },
    ],
  },
];

// Mock stagiaires data
export const MOCK_STAGIAIRES: Stagiaire[] = [
  { id: "1", nom: "Dubois", prenom: "Marie" },
  { id: "2", nom: "Martin", prenom: "Thomas" },
  { id: "3", nom: "Bernard", prenom: "Lucie" },
  { id: "4", nom: "Petit", prenom: "Antoine" },
  { id: "5", nom: "Durand", prenom: "Sophie" },
  { id: "6", nom: "Leroy", prenom: "Maxime" },
  { id: "7", nom: "Moreau", prenom: "Julie" },
  { id: "8", nom: "Simon", prenom: "Nicolas" },
];

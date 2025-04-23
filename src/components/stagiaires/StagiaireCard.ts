
export type StagiaireType = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  etablissement: string;
  formation: string;
  status: 'active' | 'completed' | 'upcoming';
  dateDebut: string;
  dateFin: string;
  intitule: string;
};

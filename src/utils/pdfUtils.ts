
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { StagiaireType } from '@/components/stagiaires/StagiaireCard';

export const generatePDF = (stagiaire: StagiaireType) => {
  // Créer une nouvelle instance de jsPDF
  const doc = new jsPDF();
  
  // Ajouter un titre
  doc.setFontSize(20);
  doc.setTextColor(0, 51, 102);
  doc.text("Fiche de Stagiaire", 105, 20, { align: 'center' });
  
  // Ajouter un sous-titre avec le nom du stagiaire
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(`${stagiaire.prenom} ${stagiaire.nom}`, 105, 30, { align: 'center' });
  
  // Ajouter une ligne de séparation
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);
  
  // Ajouter les informations personnelles sous forme de tableau
  autoTable(doc, {
    startY: 45,
    head: [['Informations Personnelles', '']],
    body: [
      ['Nom', stagiaire.nom],
      ['Prénom', stagiaire.prenom],
      ['Email', stagiaire.email],
      ['Téléphone', stagiaire.telephone]
    ],
    headStyles: { fillColor: [0, 51, 102] },
    alternateRowStyles: { fillColor: [240, 240, 240] }
  });
  
  // Ajouter les informations de formation
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [['Informations de Formation', '']],
    body: [
      ['Établissement', stagiaire.etablissement],
      ['Formation', stagiaire.formation],
      ['Intitulé du stage', stagiaire.intitule],
      ['Date de début', stagiaire.dateDebut],
      ['Date de fin', stagiaire.dateFin],
      ['Statut', getStatusLabel(stagiaire.status)]
    ],
    headStyles: { fillColor: [0, 51, 102] },
    alternateRowStyles: { fillColor: [240, 240, 240] }
  });
  
  // Ajouter un pied de page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} sur ${pageCount} - Document généré le ${new Date().toLocaleDateString()}`,
      105,
      290,
      { align: 'center' }
    );
  }
  
  // Télécharger le PDF
  const fileName = `stagiaire_${stagiaire.nom}_${stagiaire.prenom}.pdf`.toLowerCase().replace(/\s+/g, '_');
  doc.save(fileName);
};

// Fonction utilitaire pour obtenir le libellé du statut en français
function getStatusLabel(status: string): string {
  switch (status) {
    case 'active': return 'En cours';
    case 'upcoming': return 'À venir';
    case 'completed': return 'Terminé';
    default: return status;
  }
}

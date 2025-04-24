
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { StagiaireType } from '@/components/stagiaires/StagiaireCard';

// Add a type for evaluation data
export type EvaluationType = {
  id: string;
  nom: string;
  prenom: string;
  note: number;
  email?: string;
  telephone?: string;
  etablissement?: string;
  formation?: string;
  status: string;
  date: string;
  dateDebut?: string;
  dateFin?: string;
  intitule?: string;
  genre?: "masculin" | "feminin";
};

// Create a union type to handle both stagiaire and evaluation data
type PdfDataType = StagiaireType | EvaluationType;

// Check if the data is a stagiaire
const isStagiaire = (data: PdfDataType): data is StagiaireType => {
  return 'intitule' in data && data.intitule !== undefined;
};

export const generatePDF = (data: PdfDataType | PdfDataType[]) => {
  // Handle array of data
  if (Array.isArray(data)) {
    generateMultiplePDF(data);
    return;
  }

  // Create a new instance of jsPDF
  const doc = new jsPDF();
  
  // Add a title
  doc.setFontSize(20);
  doc.setTextColor(0, 51, 102);
  
  // Different title based on data type
  const title = isStagiaire(data) ? "Fiche de Stagiaire" : "Fiche d'Évaluation";
  doc.text(title, 105, 20, { align: 'center' });
  
  // Add a subtitle with the name
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(`${data.prenom} ${data.nom}`, 105, 30, { align: 'center' });
  
  // Add a line separator
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);
  
  // Add personal information as a table
  autoTable(doc, {
    startY: 45,
    head: [['Informations Personnelles', '']],
    body: [
      ['Nom', data.nom],
      ['Prénom', data.prenom],
      ['Email', data.email || 'Non spécifié'],
      ['Téléphone', data.telephone || 'Non spécifié']
    ],
    headStyles: { fillColor: [0, 51, 102] },
    alternateRowStyles: { fillColor: [240, 240, 240] }
  });
  
  const tableEnd = (doc as any).lastAutoTable.finalY;
  
  if (isStagiaire(data)) {
    // Add training information for stagiaire
    autoTable(doc, {
      startY: tableEnd + 10,
      head: [['Informations de Formation', '']],
      body: [
        ['Établissement', data.etablissement],
        ['Formation', data.formation],
        ['Intitulé du stage', data.intitule],
        ['Date de début', data.dateDebut],
        ['Date de fin', data.dateFin],
        ['Statut', getStatusLabel(data.status)]
      ],
      headStyles: { fillColor: [0, 51, 102] },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });
  } else {
    // Add evaluation information
    autoTable(doc, {
      startY: tableEnd + 10,
      head: [['Informations d\'Évaluation', '']],
      body: [
        ['Date d\'évaluation', data.date],
        ['Note attribuée', `${data.note}/20`],
        ['Établissement', data.etablissement || 'Non spécifié'],
        ['Formation', data.formation || 'Non spécifié'],
        ['Statut', data.status === 'reviewed' ? 'Évaluée' : 'En attente']
      ],
      headStyles: { fillColor: [0, 51, 102] },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });
  }
  
  // Add footer
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
  
  // Download PDF
  const fileName = isStagiaire(data)
    ? `stagiaire_${data.nom}_${data.prenom}.pdf`.toLowerCase().replace(/\s+/g, '_')
    : `evaluation_${data.nom}_${data.prenom}.pdf`.toLowerCase().replace(/\s+/g, '_');
  doc.save(fileName);
};

// Function to generate multiple PDFs
const generateMultiplePDF = (dataArray: PdfDataType[]) => {
  const doc = new jsPDF();
  
  // Add a title
  doc.setFontSize(20);
  doc.setTextColor(0, 51, 102);
  doc.text("Rapport d'évaluations", 105, 20, { align: 'center' });
  
  // Add a subtitle
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(`${dataArray.length} évaluations`, 105, 30, { align: 'center' });
  
  // Add a line separator
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);
  
  // Generate table data
  const tableData = dataArray.map((item) => [
    item.nom,
    item.prenom,
    item.email || 'Non spécifié',
    isStagiaire(item) 
      ? getStatusLabel(item.status) 
      : (item.note ? `${item.note}/20` : 'N/A')
  ]);
  
  // Add the table
  autoTable(doc, {
    startY: 45,
    head: [['Nom', 'Prénom', 'Email', isStagiaire(dataArray[0]) ? 'Statut' : 'Note']],
    body: tableData,
    headStyles: { fillColor: [0, 51, 102] },
    alternateRowStyles: { fillColor: [240, 240, 240] }
  });
  
  // Add footer
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
  
  // Download PDF
  const fileName = "rapport_evaluations.pdf";
  doc.save(fileName);
};

// Function to get status label in French
function getStatusLabel(status: string): string {
  switch (status) {
    case 'active': return 'En cours';
    case 'upcoming': return 'À venir';
    case 'completed': return 'Terminé';
    case 'reviewed': return 'Évaluée';
    default: return status;
  }
}

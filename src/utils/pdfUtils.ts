
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

// Base64 encoded image of the Madagascar flag (if it needs to be embedded)
const MADAGASCAR_FLAG = '/lovable-uploads/1518db32-6059-4a06-8198-23634f474c54.png';

export const generatePDF = (data: PdfDataType | PdfDataType[]) => {
  // Handle array of data
  if (Array.isArray(data)) {
    generateMultiplePDF(data);
    return;
  }

  // Create a new instance of jsPDF
  const doc = new jsPDF();
  
  // Add Madagascar flag
  try {
    doc.addImage(MADAGASCAR_FLAG, 'PNG', 85, 15, 40, 30);
  } catch (error) {
    console.error('Error adding flag image:', error);
  }
  
  // Add header text
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('REPOBLIKAN\'I MADAGASIKARA', 105, 55, { align: 'center' });
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('Fitiavana – Tanindrazana – Fandrosoana', 105, 61, { align: 'center' });
  
  doc.text('MINISTERE DU TRAVAIL, DE L\'EMPLOI, DE LA FONCTION PUBLIQUE ET DES LOIS SOCIALES', 105, 68, { align: 'center' });
  doc.text('SECRETARIAT GENERAL', 105, 74, { align: 'center' });
  doc.text('DIRECTION DU SYSTEME D\'INFORMATION', 105, 80, { align: 'center' });
  
  // Add a line separator
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(0.5);
  doc.line(20, 85, 190, 85);
  
  // Add a title
  doc.setFontSize(20);
  doc.setTextColor(0, 51, 102);
  
  // Different title based on data type
  const title = isStagiaire(data) ? "Fiche de Stagiaire" : "Fiche d'Évaluation";
  doc.text(title, 105, 95, { align: 'center' });
  
  // Add a subtitle with the name
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(`${data.prenom} ${data.nom}`, 105, 105, { align: 'center' });
  
  // Add a line separator
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(0.5);
  doc.line(20, 110, 190, 110);
  
  // Add personal information as a table
  autoTable(doc, {
    startY: 120,
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
  
  // Add Madagascar flag at the top
  try {
    doc.addImage(MADAGASCAR_FLAG, 'PNG', 85, 15, 40, 30);
  } catch (error) {
    console.error('Error adding flag image:', error);
  }
  
  // Add header text
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('REPOBLIKAN\'I MADAGASIKARA', 105, 55, { align: 'center' });
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('Fitiavana – Tanindrazana – Fandrosoana', 105, 61, { align: 'center' });
  
  doc.text('MINISTERE DU TRAVAIL, DE L\'EMPLOI, DE LA FONCTION PUBLIQUE ET DES LOIS SOCIALES', 105, 68, { align: 'center' });
  doc.text('SECRETARIAT GENERAL', 105, 74, { align: 'center' });
  doc.text('DIRECTION DU SYSTEME D\'INFORMATION', 105, 80, { align: 'center' });
  
  // Add a line separator
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(0.5);
  doc.line(20, 85, 190, 85);
  
  // Add a title
  doc.setFontSize(20);
  doc.setTextColor(0, 51, 102);
  doc.text("Rapport d'évaluations", 105, 95, { align: 'center' });
  
  // Add a subtitle
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(`${dataArray.length} évaluations`, 105, 105, { align: 'center' });
  
  // Add a line separator
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(0.5);
  doc.line(20, 110, 190, 110);
  
  // Generate table data with essential information only
  const tableData = dataArray.map((item) => [
    item.nom,
    item.prenom,
    isStagiaire(item) 
      ? getStatusLabel(item.status) 
      : (item.note ? `${item.note}/20` : 'N/A')
  ]);
  
  // Add the table with simplified columns
  autoTable(doc, {
    startY: 120,
    head: [['Nom', 'Prénom', isStagiaire(dataArray[0]) ? 'Statut' : 'Note']],
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

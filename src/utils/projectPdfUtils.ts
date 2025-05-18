
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Project {
  id: string;
  title: string;
  description: string;
  created_at: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: string;
}

// Base64 encoded image of the Madagascar flag
const MADAGASCAR_FLAG = '/lovable-uploads/1518db32-6059-4a06-8198-23634f474c54.png';

export const generateProjectPDF = (project: Project) => {
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
  doc.text("Fiche de Projet", 105, 95, { align: 'center' });
  
  // Add a subtitle with the title
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(`${project.title}`, 105, 105, { align: 'center' });
  
  // Add a line separator
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(0.5);
  doc.line(20, 110, 190, 110);
  
  // Add project information as a table
  autoTable(doc, {
    startY: 120,
    head: [['Informations du Projet', '']],
    body: [
      ['Titre', project.title],
      ['Date de création', new Date(project.created_at).toLocaleDateString()],
      ['Description', project.description]
    ],
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
  const fileName = `projet_${project.title}.pdf`.toLowerCase().replace(/\s+/g, '_');
  doc.save(fileName);
};

// Generate a PDF with a list of all projects
export const generateProjectsListPDF = (projects: Project[]) => {
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
  doc.text("Liste des Projets", 105, 95, { align: 'center' });
  
  // Add a subtitle
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(`${projects.length} projets`, 105, 105, { align: 'center' });
  
  // Add a line separator
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(0.5);
  doc.line(20, 110, 190, 110);
  
  // Generate table data with essential information only
  const tableData = projects.map((project) => [
    project.title,
    new Date(project.created_at).toLocaleDateString(),
    project.attachmentName ? "Oui" : "Non"
  ]);
  
  // Add the table with simplified columns
  autoTable(doc, {
    startY: 120,
    head: [['Titre', 'Date de création', 'Pièce jointe']],
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
  const fileName = "liste_des_projets.pdf";
  doc.save(fileName);
};

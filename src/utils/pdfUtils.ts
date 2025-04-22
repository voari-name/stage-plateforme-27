
import { jsPDF } from "jspdf";

type Evaluation = {
  id: string;
  nom: string;
  prenom: string;
  note: number;
  genre: "masculin" | "feminin";
  status: "pending" | "submitted" | "reviewed";
  date: string;
};

export const generatePDF = (evaluations: Evaluation[]) => {
  // Initialize the PDF document
  const doc = new jsPDF();
  
  // Add header image placeholder (you might want to add a real logo)
  doc.setDrawColor(0);
  doc.setFillColor(200, 200, 200);
  doc.circle(doc.internal.pageSize.getWidth() / 2, 20, 10, 'F');

  // Add header text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  
  // Center-align the header text
  const textLines = [
    "REPOBLIKAN'I MADAGASIKARA",
    "Fitiavana - Tanindrazana - Fandrosoana",
    "",
    "MINISTERE DU TRAVAIL, DE L'EMPLOI",
    "DE LA FONCTION PUBLIQUE ET",
    "DES LOIS SOCIALES",
    "",
    "SECRETARIAT GENERAL",
    "",
    "DIRECTION DU SYSTEME D'INFORMATION"
  ];

  let yPosition = 15;
  textLines.forEach((line, index) => {
    // Use alternative method to calculate text width without getFontSize()
    const fontSize = 12; // Using the same font size set earlier
    const textWidth = doc.getStringUnitWidth(line) * fontSize / doc.internal.scaleFactor;
    const xPosition = (doc.internal.pageSize.getWidth() - textWidth) / 2;
    doc.text(line, xPosition, yPosition);
    yPosition += (index === 1 || index === 5 || index === 7) ? 10 : 6;
  });

  // Add date on the right
  doc.setFontSize(11);
  doc.text(`Antananarivo, le ${new Date().toLocaleDateString('fr-FR')}`, 120, yPosition);
  yPosition += 15;

  // Add reference number
  doc.text(`N° _____ ${new Date().getFullYear()}/MTEFOP.SG/DSI`, 20, yPosition);
  yPosition += 20;

  // Add title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  const title = "RAPPORT D'EVALUATION STAGIAIRE";
  // Use the explicit font size instead of getFontSize()
  const titleWidth = doc.getStringUnitWidth(title) * 16 / doc.internal.scaleFactor;
  const titleX = (doc.internal.pageSize.getWidth() - titleWidth) / 2;
  doc.text(title, titleX, yPosition);
  yPosition += 20;

  // Add content for each evaluation
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  
  evaluations.forEach((evaluation, index) => {
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    const status = 
      evaluation.status === "pending" ? "En attente" : 
      evaluation.status === "submitted" ? "Soumise" : "Évaluée";

    doc.setFont("helvetica", "bold");
    doc.text(`Évaluation ${index + 1}:`, 20, yPosition);
    yPosition += 10;

    doc.setFont("helvetica", "normal");
    const content = [
      `Nom et Prénom: ${evaluation.prenom} ${evaluation.nom}`,
      `Genre: ${evaluation.genre === "masculin" ? "Masculin" : "Féminin"}`,
      `Note obtenue: ${evaluation.note}/20`,
      `Statut: ${status}`,
      `Date d'évaluation: ${evaluation.date}`
    ];

    content.forEach(line => {
      doc.text(line, 30, yPosition);
      yPosition += 8;
    });

    yPosition += 10;
  });

  // Add footer with page numbers
  const pageCount = doc.internal.pages.length;
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Page ${i} sur ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  // Save the PDF
  const timestamp = new Date().getTime();
  doc.save(`rapport-evaluations-${timestamp}.pdf`);
};


import { jsPDF } from "jspdf";
import "jspdf-autotable";

// Add the necessary type definitions for jspdf-autotable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

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
  
  // Add title
  doc.setFontSize(18);
  doc.setTextColor(75, 85, 99);
  doc.text("Rapport d'Évaluations des Stagiaires", 14, 22);
  
  // Add date
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 32);
  
  // Define the table columns and rows
  const tableColumn = ["Nom", "Prénom", "Genre", "Note", "Statut", "Date"];
  
  const tableRows = evaluations.map(evaluation => {
    const status = 
      evaluation.status === "pending" ? "En attente" : 
      evaluation.status === "submitted" ? "Soumise" : "Évaluée";
    
    return [
      evaluation.nom,
      evaluation.prenom,
      evaluation.genre === "masculin" ? "Masculin" : "Féminin",
      `${evaluation.note}/20`,
      status,
      evaluation.date
    ];
  });

  // Add the table to the PDF
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    theme: 'grid',
    styles: { 
      fontSize: 10,
      cellPadding: 3,
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [105, 108, 255],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [240, 240, 250],
    },
    margin: { top: 40 },
  });

  // Add a footer
  const pageCount = (doc as any).internal.pages.length;
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} sur ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  // Save the PDF
  doc.save("evaluations-stagiaires.pdf");
};


import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { StagiaireType } from '@/components/stagiaires/StagiaireCard';

// Update the type to accept either a single object or an array
type PDFData = StagiaireType | Record<string, string | number>[] | Record<string, string | number>;

export const generatePDF = (data: PDFData) => {
  const doc = new jsPDF();
  
  // Add heading
  doc.setFontSize(20);
  doc.text("Rapport d'évaluation", 105, 15, { align: 'center' });
  doc.setFontSize(12);
  
  // Add date
  const today = new Date().toLocaleDateString('fr-FR');
  doc.text(`Date d'émission: ${today}`, 105, 25, { align: 'center' });
  
  // Check if data is an array or a single object and handle accordingly
  const isArray = Array.isArray(data);
  
  if (isArray) {
    // For multiple records
    const tableData = data.map(item => {
      const row = [
        item.nom || '',
        item.prenom || '',
        item.etablissement || '',
        item.formation || '',
        item.dateDebut || '',
        item.dateFin || '',
        item.status || ''
      ];
      return row;
    });

    const tableHeaders = [
      'Nom',
      'Prénom',
      'Établissement',
      'Formation',
      'Date de début',
      'Date de fin',
      'Statut'
    ];

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: 35,
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineColor: [0, 0, 0],
        lineWidth: 0.1
      },
      headStyles: {
        fillColor: [63, 81, 181],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      }
    });
  } else {
    // For single record
    const singleItem = data as Record<string, string | number>;
    
    const detailsData = [];
    for (const [key, value] of Object.entries(singleItem)) {
      // Skip the id field
      if (key !== 'id' && key !== 'avatar') {
        let formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
        
        // Format key for better readability
        formattedKey = formattedKey
          .replace(/([A-Z])/g, ' $1')
          .trim();
        
        detailsData.push([formattedKey, value.toString()]);
      }
    }

    autoTable(doc, {
      body: detailsData,
      startY: 35,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
      columnStyles: {
        0: {
          fontStyle: 'bold',
          cellWidth: 50
        }
      }
    });
  }
  
  // Add signature area for single item
  if (!isArray) {
    doc.text("Signature du responsable:", 20, doc.lastAutoTable?.finalY + 30 || 200);
    doc.line(20, doc.lastAutoTable?.finalY + 50 || 220, 90, doc.lastAutoTable?.finalY + 50 || 220);
  }
  
  // Add footer
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Document généré automatiquement", 105, 280, { align: 'center' });
  
  // Save the document
  doc.save(isArray ? "rapport_evaluations.pdf" : "rapport_evaluation.pdf");
};

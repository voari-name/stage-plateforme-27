
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { StagiaireType } from '@/components/stagiaires/StagiaireCard';

type PDFData = StagiaireType | Record<string, string | number>[] | Record<string, string | number>;

export const generatePDF = (data: PDFData) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("Rapport d'évaluation", 105, 15, { align: 'center' });
  doc.setFontSize(12);

  const today = new Date().toLocaleDateString('fr-FR');
  doc.text(`Date d'émission: ${today}`, 105, 25, { align: 'center' });

  const isArray = Array.isArray(data);

  let lastTableY = 35;

  if (isArray) {
    const tableData = data.map(item => [
      item.nom || '',
      item.prenom || '',
      item.etablissement || '',
      item.formation || '',
      item.dateDebut || '',
      item.dateFin || '',
      item.status || ''
    ]);

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
      },
      didDrawPage: (data) => {
        lastTableY = data.cursor.y;
      }
    });
  } else {
    const singleItem = data as Record<string, string | number>;
    const detailsData = [];
    for (const [key, value] of Object.entries(singleItem)) {
      if (key !== 'id' && key !== 'avatar') {
        let formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
        formattedKey = formattedKey.replace(/([A-Z])/g, ' $1').trim();
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
      },
      didDrawPage: (data) => {
        lastTableY = data.cursor.y;
      }
    });
  }

  // Add signature area for single item
  if (!isArray) {
    const sigStartY = lastTableY + 30 > 200 ? lastTableY + 30 : 200;
    doc.text("Signature du responsable:", 20, sigStartY);
    doc.line(20, sigStartY + 20, 90, sigStartY + 20);
  }

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Document généré automatiquement", 105, 280, { align: 'center' });

  doc.save(isArray ? "rapport_evaluations.pdf" : "rapport_evaluation.pdf");
};

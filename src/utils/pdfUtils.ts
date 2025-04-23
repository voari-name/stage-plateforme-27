
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { StagiaireType } from '@/components/stagiaires/StagiaireCard';

type PDFData = StagiaireType | Record<string, string | number>[] | Record<string, string | number>;

export const generatePDF = (data: PDFData) => {
  const doc = new jsPDF();
  
  // Ajout d'un en-tête professionnel
  doc.setFillColor(63, 81, 181); // Couleur bleue pour l'en-tête
  doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');
  
  // Logo ou titre
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("RAPPORT D'ÉVALUATION", 105, 15, { align: 'center' });
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);

  const today = new Date().toLocaleDateString('fr-FR');
  doc.text(`Date d'émission: ${today}`, 105, 40, { align: 'center' });

  const isArray = Array.isArray(data);

  let lastTableY = 50; // Position de départ plus basse pour accommoder l'en-tête

  // Pagination
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Page ${i} sur ${totalPages}`, 105, 285, { align: 'center' });
  }

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
      startY: lastTableY,
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
        // Redessiner l'en-tête sur chaque page
        doc.setFillColor(63, 81, 181);
        doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("RAPPORT D'ÉVALUATION", 105, 15, { align: 'center' });
        doc.setTextColor(0, 0, 0);
        
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
      startY: lastTableY,
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
        // Redessiner l'en-tête sur chaque page
        doc.setFillColor(63, 81, 181);
        doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("RAPPORT D'ÉVALUATION", 105, 15, { align: 'center' });
        doc.setTextColor(0, 0, 0);
        
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

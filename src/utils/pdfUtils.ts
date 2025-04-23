
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

type Stagiaire = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  etablissement: string;
  formation: string;
  status: string;
  dateDebut: string;
  dateFin: string;
  intitule: string;
};

export const generatePDF = (stagiaire: Stagiaire) => {
  const doc = new jsPDF();

  // En-tête
  doc.setDrawColor(0);
  doc.setFillColor(200, 200, 200);
  doc.circle(doc.internal.pageSize.getWidth() / 2, 20, 10, 'F');

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);

  const headerLines = [
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
  headerLines.forEach((line, index) => {
    const fontSize = 12;
    const textWidth = doc.getStringUnitWidth(line) * fontSize / doc.internal.scaleFactor;
    const xPosition = (doc.internal.pageSize.getWidth() - textWidth) / 2;
    doc.text(line, xPosition, yPosition);
    yPosition += (index === 1 || index === 5 || index === 7) ? 10 : 6;
  });

  doc.setFontSize(11);
  doc.text(`Antananarivo, le ${new Date().toLocaleDateString('fr-FR')}`, 120, yPosition);
  yPosition += 15;
  doc.text(`N° _____ ${new Date().getFullYear()}/MTEFOP.SG/DSI`, 20, yPosition);
  yPosition += 20;

  // Titre
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  const title = "FICHE DE STAGIAIRE";
  const titleWidth = doc.getStringUnitWidth(title) * 16 / doc.internal.scaleFactor;
  const titleX = (doc.internal.pageSize.getWidth() - titleWidth) / 2;
  doc.text(title, titleX, yPosition);
  yPosition += 15;

  doc.setFontSize(13);
  doc.setFont("helvetica", "normal");

  autoTable(doc, {
    startY: yPosition,
    margin: { left: 30, right: 30 },
    styles: { fontSize: 12 },
    body: [
      [
        { content: "Nom et Prénom :", styles: { fontStyle: 'bold' } },
        `${stagiaire.prenom} ${stagiaire.nom}`
      ],
      [
        { content: "Intitulé :", styles: { fontStyle: 'bold' } },
        stagiaire.intitule
      ],
      [
        { content: "Email :", styles: { fontStyle: 'bold' } },
        stagiaire.email
      ],
      [
        { content: "Téléphone :", styles: { fontStyle: 'bold' } },
        stagiaire.telephone
      ],
      [
        { content: "Établissement :", styles: { fontStyle: 'bold' } },
        stagiaire.etablissement
      ],
      [
        { content: "Formation :", styles: { fontStyle: 'bold' } },
        stagiaire.formation
      ],
      [
        { content: "Statut :", styles: { fontStyle: 'bold' } },
        stagiaire.status
      ],
      [
        { content: "Date de Début :", styles: { fontStyle: 'bold' } },
        stagiaire.dateDebut
      ],
      [
        { content: "Date de Fin :", styles: { fontStyle: 'bold' } },
        stagiaire.dateFin
      ]
    ],
    theme: 'plain'
  });

  // Pagination
  const pageCount = doc.internal.pages.length;
  for (let i = 1; i <= pageCount; i++) {
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

  // Save
  const timestamp = new Date().getTime();
  doc.save(`fiche-stagiaire-${stagiaire.nom}-${stagiaire.prenom}-${timestamp}.pdf`);
};

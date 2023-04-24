import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportPdf = async (elementId: string, filename: string, margin = 10) => {
  const input = document.getElementById(elementId);
  if (input === null) return;

  const canvas = await html2canvas(input);
  const imgData = canvas.toDataURL('image/png');

  const pageHeight = 297;
  const imgWidth = 210 - 2 * margin;
  const imgHeight = (imgWidth * canvas.height) / canvas.width;

  let heightLeft = imgHeight;
  let paddingTop = 0;

  const doc = new jsPDF({
    unit: 'px',
    format: [297, 210],
  });

  doc.addImage(imgData, 'PNG', margin, paddingTop, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    paddingTop = heightLeft - imgHeight; // top padding for other pages
    doc.addPage();
    doc.addImage(imgData, 'PNG', margin, paddingTop, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  doc.save(filename);
};

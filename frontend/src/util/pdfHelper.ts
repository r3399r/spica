import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportPdf = (elementId: string, filename: string) => {
  const input = document.getElementById(elementId);
  if (input === null) return;

  html2canvas(input).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ unit: 'px', format: [canvas.width, canvas.height] });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    const width = pdf.internal.pageSize.getWidth();
    pdf.addImage(imgData, 'PNG', 40, 40, width - 80, pdfHeight - 80);
    pdf.save(filename);
  });
};

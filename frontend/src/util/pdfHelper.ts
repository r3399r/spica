import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportPdf = (elementId: string, filename: string, margin = 40) => {
  const input = document.getElementById(elementId);
  if (input === null) return;

  html2canvas(input).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');

    const orientation = canvas.width > canvas.height ? 'l' : 'p';
    const pdf = new jsPDF({
      orientation,
      unit: 'px',
      format: [canvas.height + 2 * margin, canvas.width + 2 * margin],
    });
    const imgProps = pdf.getImageProperties(imgData);

    pdf.addImage(imgData, 'PNG', margin, margin, imgProps.width, imgProps.height);
    pdf.save(filename);
  });
};

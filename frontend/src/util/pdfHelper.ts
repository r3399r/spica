import html2pdf from 'html3pdf';

export const exportPdf = async (elementId: string, filename: string) => {
  const input = document.getElementById(elementId);
  if (input === null) return;

  html2pdf()
    .set({
      filename,
      image: {
        type: 'jpeg',
        quality: 1,
      },
    })
    .from(input)
    .save();
};

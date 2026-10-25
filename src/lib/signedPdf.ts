
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1];
  if (!base64) throw new Error('Imagem da assinatura inválida.');

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

async function prepareSignature(signatureUrl: string): Promise<Uint8Array> {
  const image = new Image();

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('Não foi possível carregar a assinatura.'));
    image.src = signatureUrl;
  });

  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const context = canvas.getContext('2d');
  if (!context) throw new Error('Não foi possível preparar a assinatura.');

  context.drawImage(image, 0, 0);

  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = pixels.data;

  for (let i = 0; i < data.length; i += 4) {
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;

    if (brightness < 100) {
      data[i + 3] = 0;
    } else {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = Math.round(
        Math.min(255, Math.max(0, (brightness - 100) * 2))
      );
    }
  }

  context.putImageData(pixels, 0, 0);
  return dataUrlToBytes(canvas.toDataURL('image/png'));
}

export async function downloadSignedPdf(
  pdfUrl: string,
  signatureUrl: string,
  fileName: string,
  signedAt: string
): Promise<void> {
  if (!pdfUrl || !signatureUrl || !signedAt) {
    throw new Error('Documento, assinatura ou data de assinatura ausente.');
  }

  const response = await fetch(pdfUrl);

  if (!response.ok) {
    throw new Error('Não foi possível carregar o PDF original.');
  }

  const originalBytes = new Uint8Array(await response.arrayBuffer());
  const pdf = await PDFDocument.load(originalBytes);

  if (pdf.getPageCount() === 0) {
    throw new Error('O PDF não contém páginas.');
  }

  const page = pdf.getPages()[pdf.getPageCount() - 1];
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const signatureBytes = await prepareSignature(signatureUrl);
  const signature = await pdf.embedPng(signatureBytes);

  const margin = 30;
  const signatureWidth = 150;
  const signatureHeight = Math.min(
    42,
    signatureWidth * signature.height / signature.width
  );

  // Área reservada no rodapé da última página.
  // Confira se o documento original possui espaço livre nesse local.
  page.drawLine({
    start: { x: margin, y: margin + 43 },
    end: { x: margin + 210, y: margin + 43 },
    thickness: 0.6,
    color: rgb(0.25, 0.25, 0.25),
  });

  page.drawImage(signature, {
    x: margin + 5,
    y: margin + 43,
    width: signatureWidth,
    height: signatureHeight,
  });

  page.drawText(
    `Assinado eletronicamente em ${new Date(signedAt).toLocaleDateString('pt-BR')}`,
    {
      x: margin,
      y: margin + 29,
      size: 8,
      font,
      color: rgb(0.15, 0.15, 0.15),
    }
  );

  const signedBytes = await pdf.save();
  const blob = new Blob([signedBytes as BlobPart], {
    type: 'application/pdf',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName.toLowerCase().endsWith('.pdf')
    ? fileName
    : `${fileName}.pdf`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

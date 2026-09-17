/**
 * Utility to extract text from user-uploaded .pdf and .txt files client-side.
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'txt') {
    return await file.text();
  }

  if (extension === 'pdf') {
    if (typeof window === 'undefined') {
      throw new Error('PDF extraction is only available in the browser.');
    }

    try {
      const pdfjs = await import('pdfjs-dist/build/pdf');
      
      // Ensure worker is configured properly using CDN matching version
      if (!pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version || '3.11.174'}/pdf.worker.min.js`;
      }

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageItems = textContent.items
          .map((item: any) => ('str' in item ? item.str : ''))
          .join(' ');
        fullText += pageItems + '\n\n';
      }

      const trimmed = fullText.trim();
      if (!trimmed) {
        throw new Error('No readable text could be extracted from this PDF. It may be scanned or image-based.');
      }
      return trimmed;
    } catch (err: any) {
      console.error('PDF extraction error:', err);
      throw new Error(err.message || 'Failed to extract text from the PDF file.');
    }
  }

  throw new Error(`Unsupported file type (.${extension}). Please upload a .pdf or .txt file.`);
}

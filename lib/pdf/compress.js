import { PDFDocument } from "pdf-lib";

/**
 * Compress (Optimize) a PDF
 * Note: pdf-lib has limited compression capabilities. This performs structural cleanup.
 * @param {File} file - The source PDF file
 * @returns {Promise<Blob>}
 */
export async function compressPdf(file) {
    const arrayBuffer = await file.arrayBuffer();

    // Load the PDF
    const pdf = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
    });

    // Create a new PDF and copy pages to it (this often reduces size by removing unused objects)
    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => newPdf.addPage(page));

    // Save with object stream compression (default in pdf-lib)
    const bytes = await newPdf.save({ useObjectStreams: true });

    return new Blob([bytes], { type: "application/pdf" });
}

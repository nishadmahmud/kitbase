import { PDFDocument } from "pdf-lib";

/**
 * Reorder pages in a PDF
 * @param {File} file - The source PDF file
 * @param {Array<number>} newOrder - Array of 0-based page indices in the desired order
 * @returns {Promise<Blob>}
 */
export async function reorderPdf(file, newOrder) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const newPdf = await PDFDocument.create();

    const copiedPages = await newPdf.copyPages(pdf, newOrder);
    copiedPages.forEach((page) => newPdf.addPage(page));

    const bytes = await newPdf.save();
    return new Blob([bytes], { type: "application/pdf" });
}

/**
 * Get page count of a PDF
 * @param {File} file
 * @returns {Promise<number>}
 */
export async function getPdfPageCount(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    return pdf.getPageCount();
}

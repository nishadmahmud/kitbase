import { PDFDocument } from "pdf-lib";

/**
 * Split a PDF into individual pages
 * @param {File} file - The source PDF file
 * @returns {Promise<Array<{name: string, blob: Blob}>>}
 */
export async function splitPdf(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const pageCount = pdf.getPageCount();
    const result = [];

    const baseName = file.name.replace(/\.pdf$/i, "");

    for (let i = 0; i < pageCount; i++) {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdf, [i]);
        newPdf.addPage(copiedPage);
        const bytes = await newPdf.save();
        const blob = new Blob([bytes], { type: "application/pdf" });
        result.push({
            name: `${baseName}-page-${i + 1}.pdf`,
            blob,
        });
    }

    return result;
}

import { PDFDocument } from "pdf-lib";

/**
 * Split a PDF into individual pages or specific ranges.
 * @param {File} file - The source PDF file
 * @param {Object} options - Split options
 * @returns {Promise<Array<{name: string, blob: Blob}>>}
 */
export async function splitPdf(file, options = { mode: 'extract-all' }) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const pageCount = pdf.getPageCount();
    const result = [];

    const baseName = file.name.replace(/\.pdf$/i, "");
    const { mode, ranges = [], fixedCount = 1, extractPages = "", merge = false } = options;

    // Helper to generate a PDF blob from a list of 0-based page indices
    const createPdfFromIndices = async (indices, suffixName) => {
        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(pdf, indices);
        copiedPages.forEach((page) => newPdf.addPage(page));
        const bytes = await newPdf.save();
        const blob = new Blob([bytes], { type: "application/pdf" });
        return { name: `${baseName}-${suffixName}.pdf`, blob };
    };

    // Helper to parse page number strings like "1,5-8" 
    const parseExtractString = (str, maxPages) => {
        const pages = new Set();
        const parts = str.split(',').map(p => p.trim()).filter(Boolean);
        for (const part of parts) {
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(Number);
                if (!isNaN(start) && !isNaN(end)) {
                    const s = Math.max(1, Math.min(start, end));
                    const e = Math.min(maxPages, Math.max(start, end));
                    for (let i = s; i <= e; i++) {
                        pages.add(i - 1);
                    }
                }
            } else {
                const p = Number(part);
                if (!isNaN(p) && p >= 1 && p <= maxPages) {
                    pages.add(p - 1);
                }
            }
        }
        return Array.from(pages).sort((a, b) => a - b);
    };

    if (mode === 'extract-all') {
        for (let i = 0; i < pageCount; i++) {
            result.push(await createPdfFromIndices([i], `page-${i + 1}`));
        }
    } else if (mode === 'extract-select') {
        const indices = parseExtractString(extractPages, pageCount);
        if (indices.length === 0) throw new Error("No valid pages selected for extraction.");

        if (merge) {
            result.push(await createPdfFromIndices(indices, `extracted-merged`));
        } else {
            for (const i of indices) {
                result.push(await createPdfFromIndices([i], `page-${i + 1}`));
            }
        }
    } else if (mode === 'custom-range') {
        if (ranges.length === 0) throw new Error("No ranges specified.");

        if (merge) {
            const allIndices = [];
            for (const r of ranges) {
                const from = Math.max(1, r.from) - 1;
                const to = Math.min(pageCount, r.to) - 1;
                for (let i = from; i <= to; i++) {
                    allIndices.push(i);
                }
            }
            if (allIndices.length === 0) throw new Error("Invalid ranges.");
            result.push(await createPdfFromIndices(allIndices, `merged-ranges`));
        } else {
            for (let idx = 0; idx < ranges.length; idx++) {
                const r = ranges[idx];
                const from = Math.max(1, r.from) - 1;
                const to = Math.min(pageCount, r.to) - 1;
                const indices = [];
                for (let i = from; i <= to; i++) {
                    indices.push(i);
                }
                if (indices.length > 0) {
                    result.push(await createPdfFromIndices(indices, `range-${r.from}-${r.to}`));
                }
            }
        }
    } else if (mode === 'fixed-range') {
        const count = Math.max(1, fixedCount);
        for (let i = 0; i < pageCount; i += count) {
            const indices = [];
            for (let j = i; j < Math.min(i + count, pageCount); j++) {
                indices.push(j);
            }
            if (indices.length > 0) {
                const from = indices[0] + 1;
                const to = indices[indices.length - 1] + 1;
                result.push(await createPdfFromIndices(indices, `range-${from}-${to}`));
            }
        }
    } else {
        throw new Error("Invalid split mode.");
    }

    return result;
}

import { PDFDocument } from "pdf-lib";

/**
 * Compress (Optimize) a PDF
 * Note: pdf-lib has limited compression capabilities. This performs structural cleanup.
 * @param {File} file - The source PDF file
 * @param {{ mode?: "structural" | "ghostscript", preset?: "screen" | "ebook" | "printer" | "prepress" }} [options]
 * @returns {Promise<Blob>}
 */
export async function compressPdf(file, options = {}) {
    const { mode = "ghostscript", preset = "ebook" } = options;

    if (mode === "ghostscript") {
        // Run Ghostscript in a worker to keep UI responsive
        const inputBytes = await file.arrayBuffer();

        const worker = new Worker("/gs-worker.js");

        const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

        const result = await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error("Compression timed out. Try a smaller PDF or a lower compression level."));
                worker.terminate();
            }, 4 * 60 * 1000);

            worker.onmessage = (event) => {
                const data = event.data;
                if (!data || data.id !== id) return;
                clearTimeout(timeout);
                worker.terminate();
                if (data.ok) resolve(data.outputBytes);
                else reject(new Error(data.error || "Compression failed"));
            };

            worker.onerror = () => {
                clearTimeout(timeout);
                worker.terminate();
                reject(new Error("Compression worker crashed"));
            };

            worker.postMessage({ id, inputBytes, preset }, [inputBytes]);
        });

        return new Blob([result], { type: "application/pdf" });
    }

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

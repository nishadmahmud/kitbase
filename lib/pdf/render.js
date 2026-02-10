
/**
 * Render PDF pages to images (data URLs)
 * @param {File} file - The PDF file
 * @param {Object} options - { scale, width, quality, type }
 * @returns {Promise<string[]>} - Array of base64 image strings
 */
export async function renderPdfPages(file, options = {}) {
    if (typeof window === "undefined") return [];

    // Dynamic import to avoid build-time errors with DOMMatrix/Canvas
    const pdfJS = await import("pdfjs-dist");
    const { getDocument, GlobalWorkerOptions, version } = pdfJS;

    // Set worker source to CDN to avoid build configuration issues
    if (!GlobalWorkerOptions.workerSrc) {
        GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = getDocument(arrayBuffer);
    const pdf = await loadingTask.promise;
    const pageCount = pdf.numPages;
    const images = [];

    // Determine scale strategy
    // Default to thumbnail size (width ~200px) if no options provided
    let scale = options.scale || 1.5; // Default better quality than before

    if (options.width) {
        const firstPage = await pdf.getPage(1);
        const viewport = firstPage.getViewport({ scale: 1 });
        scale = options.width / viewport.width;
    }

    const imageType = options.type || "image/jpeg";
    const imageQuality = options.quality || 0.8;

    for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: context,
            viewport: viewport,
        };
        await page.render(renderContext).promise;

        images.push(canvas.toDataURL(imageType, imageQuality));
    }

    return images;
}

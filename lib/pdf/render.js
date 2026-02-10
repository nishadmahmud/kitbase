import { getDocument, GlobalWorkerOptions, version } from "pdfjs-dist";

// Set worker source to CDN to avoid build configuration issues
// We use a specific version matching the package generally, or 'latest' if we want to be risky.
// Ideally usage matches package.json version. Let's use a recent stable version or try to detect.
// For simplicity and robustness without complex build steps, we'll point to unpkg.
if (typeof window !== "undefined" && !GlobalWorkerOptions.workerSrc) {
    GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
}

/**
 * Render PDF pages to images (data URLs)
 * @param {File} file - The PDF file
 * @param {number} scale - Scale factor for rendering (default 0.5 for thumbnails)
 * @returns {Promise<string[]>} - Array of base64 image strings
 */
export async function renderPdfPages(file) {
    if (typeof window === "undefined") return [];

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const pageCount = pdf.numPages;
    const images = [];

    // Scale logic: target thumbnail width of ~200px
    // First get a page to determine scale
    const firstPage = await pdf.getPage(1);
    const viewport = firstPage.getViewport({ scale: 1 });
    const scale = 200 / viewport.width;

    for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const vp = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = vp.height;
        canvas.width = vp.width;

        const renderContext = {
            canvasContext: context,
            viewport: vp,
        };
        await page.render(renderContext).promise;

        images.push(canvas.toDataURL("image/jpeg", 0.8));
    }

    return images;
}

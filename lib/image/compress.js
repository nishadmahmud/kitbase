import imageCompression from "browser-image-compression";

/**
 * Compress an image file
 * @param {File} file - The source image file
 * @param {Object} options - Compression options
 * @returns {Promise<File>}
 */
export async function compressImage(file, options = {}) {
    const defaultOptions = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        ...options,
    };

    try {
        const compressedFile = await imageCompression(file, defaultOptions);
        return compressedFile;
    } catch (error) {
        throw new Error("Compression failed: " + error.message);
    }
}

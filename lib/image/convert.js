/**
 * Convert an image file to a different format
 * @param {File} file - The source image file
 * @param {string} format - The target MIME type (image/png, image/jpeg, image/webp)
 * @param {number} quality - Quality (0 to 1) for jpeg/webp
 * @returns {Promise<Blob>}
 */
export async function convertImage(file, format = "image/png", quality = 0.92) {
    return new Promise((resolve, reject) => {
        const img = new window.Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            canvas.toBlob(
                (blob) => {
                    URL.revokeObjectURL(url);
                    if (blob) resolve(blob);
                    else reject(new Error("Conversion failed"));
                },
                format,
                quality
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Failed to load image"));
        };

        img.src = url;
    });
}

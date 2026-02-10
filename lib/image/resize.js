export async function resizeImage(file, { width, height, maintainAspect = true, format = "image/png", quality = 0.9 }) {
    return new Promise((resolve, reject) => {
        const img = new window.Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            let targetWidth = width || img.naturalWidth;
            let targetHeight = height || img.naturalHeight;

            if (maintainAspect) {
                const aspect = img.naturalWidth / img.naturalHeight;
                if (width && !height) {
                    targetHeight = Math.round(targetWidth / aspect);
                } else if (height && !width) {
                    targetWidth = Math.round(targetHeight * aspect);
                } else if (width && height) {
                    const fitByWidth = targetWidth / aspect;
                    if (fitByWidth <= targetHeight) {
                        targetHeight = Math.round(fitByWidth);
                    } else {
                        targetWidth = Math.round(targetHeight * aspect);
                    }
                }
            }

            const canvas = document.createElement("canvas");
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext("2d");
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

            canvas.toBlob(
                (blob) => {
                    URL.revokeObjectURL(url);
                    if (blob) {
                        resolve({
                            blob,
                            width: targetWidth,
                            height: targetHeight,
                            originalWidth: img.naturalWidth,
                            originalHeight: img.naturalHeight,
                        });
                    } else {
                        reject(new Error("Canvas toBlob failed"));
                    }
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

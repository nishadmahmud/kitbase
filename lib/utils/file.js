export function formatFileSize(bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function getFileExtension(filename) {
    return filename.slice(filename.lastIndexOf(".")).toLowerCase();
}

export function validateFileType(file, acceptedTypes) {
    const ext = getFileExtension(file.name);
    return acceptedTypes.includes(ext) || acceptedTypes.includes(file.type);
}

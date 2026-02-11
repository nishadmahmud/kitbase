"use client";

import { useState } from "react";
import { Info, FileText, Download, X, Image as ImageIcon, Video, Music } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolDropzone from "@/components/tool/ToolDropzone";
import { cn } from "@/lib/utils/cn";

export default function MetadataViewerPage() {
    const [file, setFile] = useState(null);
    const [metadata, setMetadata] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileSelect = (files) => {
        if (files?.[0]) {
            setFile(files[0]);
            extractMetadata(files[0]);
        }
    };

    const extractMetadata = async (f) => {
        setIsProcessing(true);
        const data = [];

        // 1. Basic File Info
        data.push({ group: "Basic Info", key: "Name", value: f.name });
        data.push({ group: "Basic Info", key: "Size", value: formatBytes(f.size) });
        data.push({ group: "Basic Info", key: "Type", value: f.type || "Unknown" });
        data.push({ group: "Basic Info", key: "Last Modified", value: new Date(f.lastModified).toLocaleString() });

        try {
            // 2. Image Specific
            if (f.type.startsWith("image/")) {
                const dimensions = await getImageDimensions(f);
                if (dimensions) {
                    data.push({ group: "Image Info", key: "Dimensions", value: `${dimensions.width} x ${dimensions.height} px` });
                    data.push({ group: "Image Info", key: "Aspect Ratio", value: (dimensions.width / dimensions.height).toFixed(2) });
                }
            }

            // 3. PDF Specific
            if (f.type === "application/pdf") {
                const arrayBuffer = await f.arrayBuffer();
                // Use relaxed loading to read even slightly broken PDFs if possible
                const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
                // ignoreEncryption might help read metadata of encrypted files? No, usually fails.

                data.push({ group: "PDF Info", key: "Page Count", value: pdfDoc.getPageCount().toString() });

                const title = pdfDoc.getTitle();
                if (title) data.push({ group: "PDF Info", key: "Title", value: title });

                const author = pdfDoc.getAuthor();
                if (author) data.push({ group: "PDF Info", key: "Author", value: author });

                const subject = pdfDoc.getSubject();
                if (subject) data.push({ group: "PDF Info", key: "Subject", value: subject });

                const creator = pdfDoc.getCreator();
                if (creator) data.push({ group: "PDF Info", key: "Creator", value: creator });

                const producer = pdfDoc.getProducer();
                if (producer) data.push({ group: "PDF Info", key: "Producer", value: producer });

                const creationDate = pdfDoc.getCreationDate();
                if (creationDate) data.push({ group: "PDF Info", key: "Creation Date", value: creationDate.toLocaleString() });

                const modDate = pdfDoc.getModificationDate();
                if (modDate) data.push({ group: "PDF Info", key: "Modification Date", value: modDate.toLocaleString() });
            }

            // 4. Video/Audio Specific
            if (f.type.startsWith("video/") || f.type.startsWith("audio/")) {
                const mediaInfo = await getMediaDuration(f);
                if (mediaInfo) {
                    data.push({ group: "Media Info", key: "Duration", value: formatDuration(mediaInfo.duration) });
                    if (mediaInfo.width) {
                        data.push({ group: "Media Info", key: "Dimensions", value: `${mediaInfo.width} x ${mediaInfo.height} px` });
                    }
                }
            }

        } catch (e) {
            console.error("Metadata extraction error:", e);
            data.push({ group: "Error", key: "Extraction Failed", value: "Could not read deep metadata (file might be encrypted or corrupted)." });
        }

        setMetadata(data);
        setIsProcessing(false);
    };

    const getImageDimensions = (file) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
            img.onerror = () => resolve(null);
            img.src = URL.createObjectURL(file);
        });
    };

    const getMediaDuration = (file) => {
        return new Promise((resolve) => {
            const element = file.type.startsWith("video/") ? document.createElement("video") : document.createElement("audio");
            element.preload = "metadata";
            element.onloadedmetadata = () => {
                resolve({
                    duration: element.duration,
                    width: element.videoWidth,
                    height: element.videoHeight
                });
            };
            element.onerror = () => resolve(null);
            element.src = URL.createObjectURL(file);
        });
    };

    const formatBytes = (bytes, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    const formatDuration = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return [h, m, s].map(v => v < 10 ? '0' + v : v).filter((v, i) => v !== '00' || i > 0).join(':');
    };

    const downloadJson = () => {
        const json = JSON.stringify(metadata.reduce((acc, item) => {
            if (!acc[item.group]) acc[item.group] = {};
            acc[item.group][item.key] = item.value;
            return acc;
        }, {}), null, 2);

        const blob = new Blob([json], { type: "application/json" });
        saveAs(blob, `${file.name}-metadata.json`);
    };

    // Group metadata for display
    const groupedMetadata = metadata.reduce((acc, item) => {
        if (!acc[item.group]) acc[item.group] = [];
        acc[item.group].push(item);
        return acc;
    }, {});

    return (
        <div className="min-h-screen pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="Metadata Viewer"
                    description="Extract hidden details from your files, including EXIF data, PDF properties, and more."
                />
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10 flex flex-col gap-8">

                {/* Upload Section */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                    {!file ? (
                        <ToolDropzone
                            onFiles={handleFileSelect}
                            label="Click or drag file to view metadata"
                            multiple={false}
                        />
                    ) : (
                        <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl">
                            <div className="flex items-center gap-4 relative group overflow-hidden">
                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 flex-shrink-0">
                                    {file.type.startsWith("image/") ? <ImageIcon size={24} /> :
                                        file.type.startsWith("video/") ? <Video size={24} /> :
                                            file.type.startsWith("audio/") ? <Music size={24} /> :
                                                file.type === "application/pdf" ? <FileText size={24} /> :
                                                    <Info size={24} />}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate max-w-[200px] md:max-w-md">{file.name}</p>
                                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={downloadJson}
                                    title="Export JSON"
                                    className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                                >
                                    <Download size={18} />
                                </button>
                                <button
                                    onClick={() => { setFile(null); setMetadata([]); }}
                                    className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {isProcessing && (
                    <div className="text-center py-12">
                        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-500 dark:text-gray-400">Extracting metadata...</p>
                    </div>
                )}

                {/* Metadata Grid */}
                {!isProcessing && file && metadata.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {Object.entries(groupedMetadata).map(([group, items]) => (
                            <div key={group} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden h-fit shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                                <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-3 border-b border-gray-200 dark:border-gray-800">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200">{group}</h3>
                                </div>
                                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                                    {items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                            <span className="text-sm text-gray-500 font-medium">{item.key}</span>
                                            <span className="text-sm text-gray-900 dark:text-gray-200 text-right font-mono truncate max-w-[200px]" title={item.value}>
                                                {item.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

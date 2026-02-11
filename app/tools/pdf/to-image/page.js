"use client";

import { useState, useCallback } from "react";
import { Download, FileText, Image as ImageIcon, Loader2, Archive, Settings, RefreshCw } from "lucide-react";
import JSZip from "jszip";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolDropzone from "@/components/tool/ToolDropzone";
import ToolActions, { ActionButton } from "@/components/tool/ToolActions";
import ToolResult from "@/components/tool/ToolResult";
import { renderPdfPages } from "@/lib/pdf/render";
import { downloadBlob, downloadDataUrl } from "@/lib/utils/download";

export default function PdfToImagePage() {
    const [file, setFile] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [format, setFormat] = useState("jpeg"); // jpeg, png
    const [quality, setQuality] = useState(0.9);
    const [scale, setScale] = useState(2); // Higher scale for better quality

    const handleFiles = useCallback(async (files) => {
        const f = files[0];
        setFile(f);
        setImages([]);
    }, []);

    const processPdf = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const type = format === "png" ? "image/png" : "image/jpeg";
            const imgs = await renderPdfPages(file, {
                scale: scale,
                type: type,
                quality: quality
            });
            setImages(imgs);
        } catch (err) {
            console.error(err);
            alert("Failed to convert PDF. The file might be corrupted or password protected.");
        }
        setLoading(false);
    };

    const downloadZip = async () => {
        if (images.length === 0) return;
        const zip = new JSZip();
        const ext = format === "png" ? "png" : "jpg";

        images.forEach((img, i) => {
            const base64Data = img.split(',')[1];
            zip.file(`page-${i + 1}.${ext}`, base64Data, { base64: true });
        });

        const blob = await zip.generateAsync({ type: "blob" });
        downloadBlob(blob, `${file.name.replace(".pdf", "")}-images.zip`);
    };

    return (
        <div className="container mx-auto py-10 px-6 max-w-7xl">
            <ToolHeader
                title="PDF to Image"
                description="Convert PDF pages into high-quality JPG or PNG images."
                breadcrumbs={[{ label: "PDF Tools", href: "/category/pdf" }, { label: "PDF to Image" }]}
            />

            <div className="max-w-3xl mx-auto">
                {!file ? (
                    <ToolDropzone
                        onFiles={handleFiles}
                        accept=".pdf"
                        multiple={false}
                        label="Upload PDF to convert"
                        supportedText="Supported: .PDF (Max 50MB)"
                    />
                ) : (
                    <div className="flex flex-col gap-6">
                        {/* File Info */}
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <FileText className="text-gray-100" />
                                <div>
                                    <p className="font-medium text-gray-200 m-0">{file.name}</p>
                                    <p className="text-xs text-gray-400 m-0">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button
                                onClick={() => { setFile(null); setImages([]); }}
                                className="text-red-500 bg-transparent border-none cursor-pointer text-sm font-medium hover:text-red-400"
                            >
                                Change
                            </button>
                        </div>

                        {/* Settings */}
                        {images.length === 0 && (
                            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4 flex items-center gap-2">
                                    <Settings size={16} /> Conversion Settings
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm text-gray-200 mb-2 font-medium">Format</label>
                                        <div className="flex gap-2">
                                            {["jpeg", "png"].map(f => (
                                                <button
                                                    key={f}
                                                    onClick={() => setFormat(f)}
                                                    className={`flex-1 py-2 rounded-lg border text-xs font-semibold uppercase transition-colors ${format === f
                                                        ? "border-gray-500 bg-gray-800 text-gray-100"
                                                        : "border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                                                        }`}
                                                >
                                                    {f}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-200 mb-2 font-medium">Quality (Scale)</label>
                                        <select
                                            value={scale}
                                            onChange={(e) => setScale(Number(e.target.value))}
                                            className="w-full p-2.5 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 outline-none focus:border-gray-500 transition-colors"
                                        >
                                            <option value={1}>1x (Screen)</option>
                                            <option value={2}>2x (High Res)</option>
                                            <option value={3}>3x (Print)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        {images.length === 0 ? (
                            <ActionButton onClick={processPdf} loading={loading} icon={RefreshCw} fullWidth>
                                Convert to Images
                            </ActionButton>
                        ) : (
                            <div className="flex flex-col gap-6">
                                <ToolResult success message={`Successfully converted ${images.length} pages.`} />

                                <div className="flex gap-3">
                                    <ActionButton onClick={downloadZip} icon={Archive} fullWidth>Download All (ZIP)</ActionButton>
                                    <ActionButton onClick={() => { setImages([]); }} variant="secondary" icon={RefreshCw}>Start Over</ActionButton>
                                </div>

                                <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
                                    {images.map((img, idx) => (
                                        <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-800">
                                            <img src={img} alt={`Page ${idx + 1}`} className="w-full h-auto block" />
                                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <span className="text-xs text-white font-medium pl-1">Page {idx + 1}</span>
                                                <button
                                                    onClick={() => downloadDataUrl(img, `page-${idx + 1}.${format === 'png' ? 'png' : 'jpg'}`)}
                                                    className="p-1.5 bg-white text-black rounded hover:bg-gray-200 transition-colors"
                                                    title="Download Image"
                                                >
                                                    <Download size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

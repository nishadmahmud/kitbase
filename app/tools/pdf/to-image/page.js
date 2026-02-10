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
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
            <ToolHeader
                title="PDF to Image"
                description="Convert PDF pages into high-quality JPG or PNG images."
                breadcrumbs={[{ label: "PDF Tools", href: "/category/pdf" }, { label: "PDF to Image" }]}
            />

            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                {!file ? (
                    <ToolDropzone
                        onFiles={handleFiles}
                        accept=".pdf"
                        multiple={false}
                        label="Upload PDF to convert"
                        supportedText="Supported: .PDF (Max 50MB)"
                    />
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        {/* File Info */}
                        <div style={{ backgroundColor: "#171a21", border: "1px solid #2a2f3a", borderRadius: "16px", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <FileText style={{ color: "#4f8cff" }} />
                                <div>
                                    <p style={{ fontWeight: 500, color: "#e6e8ee", margin: 0 }}>{file.name}</p>
                                    <p style={{ fontSize: "12px", color: "#9aa0aa", margin: 0 }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button onClick={() => { setFile(null); setImages([]); }} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}>Change</button>
                        </div>

                        {/* Settings */}
                        {images.length === 0 && (
                            <div style={{ backgroundColor: "#171a21", border: "1px solid #2a2f3a", borderRadius: "16px", padding: "20px" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#9aa0aa", textTransform: "uppercase", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Settings size={16} /> Conversion Settings
                                </h3>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: "14px", color: "#e6e8ee", marginBottom: "8px" }}>Format</label>
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            {["jpeg", "png"].map(f => (
                                                <button
                                                    key={f}
                                                    onClick={() => setFormat(f)}
                                                    style={{
                                                        flex: 1, padding: "8px", borderRadius: "8px", border: "1px solid",
                                                        borderColor: format === f ? "#4f8cff" : "#3f4451",
                                                        backgroundColor: format === f ? "rgba(79, 140, 255, 0.1)" : "#2a2f3a",
                                                        color: format === f ? "#4f8cff" : "#e6e8ee",
                                                        cursor: "pointer", textTransform: "uppercase", fontSize: "12px", fontWeight: 600
                                                    }}
                                                >
                                                    {f}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "14px", color: "#e6e8ee", marginBottom: "8px" }}>Quality (Scale)</label>
                                        <select
                                            value={scale}
                                            onChange={(e) => setScale(Number(e.target.value))}
                                            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #3f4451", backgroundColor: "#2a2f3a", color: "#e6e8ee", outline: "none" }}
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
                            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                                <ToolResult success message={`Successfully converted ${images.length} pages.`} />

                                <div style={{ display: "flex", gap: "12px" }}>
                                    <ActionButton onClick={downloadZip} icon={Archive} fullWidth>Download All (ZIP)</ActionButton>
                                    <ActionButton onClick={() => { setImages([]); }} variant="secondary" icon={RefreshCw}>Start Over</ActionButton>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "16px" }}>
                                    {images.map((img, idx) => (
                                        <div key={idx} style={{ position: "relative", group: "group" }}>
                                            <img src={img} alt={`Page ${idx + 1}`} style={{ width: "100%", borderRadius: "8px", border: "1px solid #2a2f3a" }} />
                                            <div style={{ position: "absolute", bottom: "0", left: "0", right: "0", padding: "8px", background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <span style={{ fontSize: "12px", color: "white", fontWeight: 500 }}>Page {idx + 1}</span>
                                                <button
                                                    onClick={() => downloadDataUrl(img, `page-${idx + 1}.${format === 'png' ? 'png' : 'jpg'}`)}
                                                    style={{ padding: "4px", backgroundColor: "white", borderRadius: "4px", border: "none", cursor: "pointer", display: "flex" }}
                                                    title="Download Image"
                                                >
                                                    <Download size={12} color="black" />
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

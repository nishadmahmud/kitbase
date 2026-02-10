"use client";

import { useState, useCallback } from "react";
import { Merge, FileText, GripVertical, X, Download, Info } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolDropzone from "@/components/tool/ToolDropzone";
import ToolActions, { ActionButton } from "@/components/tool/ToolActions";
import ToolResult from "@/components/tool/ToolResult";
import { mergePdfs } from "@/lib/pdf/merge";
import { downloadBlob } from "@/lib/utils/download";
import { formatFileSize } from "@/lib/utils/file";

export default function MergePdfPage() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [mergedBlob, setMergedBlob] = useState(null);
    const [dragIdx, setDragIdx] = useState(null);

    const handleFiles = useCallback((newFiles) => {
        const pdfs = newFiles.filter((f) => f.type === "application/pdf" || f.name.endsWith(".pdf"));
        setFiles((prev) => [...prev, ...pdfs]);
        setResult(null);
        setError(null);
    }, []);

    const removeFile = (i) => {
        setFiles((prev) => prev.filter((_, idx) => idx !== i));
        setResult(null);
    };

    const handleDragStart = (i) => setDragIdx(i);
    const handleDragOver = (e, i) => {
        e.preventDefault();
        if (dragIdx === null || dragIdx === i) return;
        setFiles((prev) => {
            const next = [...prev];
            const [item] = next.splice(dragIdx, 1);
            next.splice(i, 0, item);
            return next;
        });
        setDragIdx(i);
    };
    const handleDragEnd = () => setDragIdx(null);

    const handleMerge = async () => {
        setLoading(true);
        setError(null);
        try {
            const blob = await mergePdfs(files);
            setMergedBlob(blob);
            setResult({
                title: "PDFs merged successfully!",
                description: `${files.length} files → ${formatFileSize(blob.size)}`,
            });
        } catch (e) {
            setError(e.message);
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
            <ToolHeader
                title="Merge PDF"
                description="Combine multiple PDF files into a single document with ease and speed."
                breadcrumbs={[{ label: "PDF Tools", href: "/category/pdf" }, { label: "Merge PDF" }]}
            />

            <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
                {/* Main */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <ToolDropzone
                        onFiles={handleFiles}
                        accept=".pdf"
                        multiple={true}
                        label="Drag & drop PDF files here"
                        sublabel="or click to browse from your computer"
                        supportedText="Supported: .PDF (Max 50MB each)"
                    />

                    {files.length > 0 && (
                        <div style={{ marginTop: "24px", backgroundColor: "#171a21", border: "1px solid #2a2f3a", borderRadius: "16px", overflow: "hidden" }}>
                            <div style={{ padding: "14px 20px", borderBottom: "1px solid #2a2f3a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <span style={{ fontSize: "14px", fontWeight: 600, color: "#9aa0aa" }}>
                                    {files.length} file{files.length !== 1 && "s"} added
                                </span>
                                <button
                                    onClick={() => { setFiles([]); setResult(null); }}
                                    style={{ fontSize: "13px", color: "#f87171", background: "none", border: "none", cursor: "pointer" }}
                                >
                                    Clear all
                                </button>
                            </div>
                            <div>
                                {files.map((file, i) => (
                                    <div
                                        key={`${file.name}-${i}`}
                                        draggable
                                        onDragStart={() => handleDragStart(i)}
                                        onDragOver={(e) => handleDragOver(e, i)}
                                        onDragEnd={handleDragEnd}
                                        style={{
                                            display: "flex", alignItems: "center", gap: "12px",
                                            padding: "12px 20px", cursor: "grab",
                                            borderBottom: i < files.length - 1 ? "1px solid #2a2f3a" : "none",
                                            backgroundColor: dragIdx === i ? "#1e2230" : "transparent",
                                            opacity: dragIdx === i ? 0.6 : 1,
                                        }}
                                    >
                                        <GripVertical style={{ width: "16px", height: "16px", color: "#6b7280", flexShrink: 0 }} />
                                        <FileText style={{ width: "16px", height: "16px", color: "#4f8cff", flexShrink: 0 }} />
                                        <span style={{ flex: 1, fontSize: "14px", color: "#e6e8ee", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</span>
                                        <span style={{ fontSize: "12px", color: "#6b7280", flexShrink: 0 }}>{formatFileSize(file.size)}</span>
                                        <button
                                            onClick={() => removeFile(i)}
                                            style={{ color: "#6b7280", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}
                                        >
                                            <X style={{ width: "16px", height: "16px" }} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <ToolActions>
                        <ActionButton
                            onClick={handleMerge}
                            disabled={files.length < 2}
                            loading={loading}
                            icon={Merge}
                        >
                            Merge {files.length > 1 ? `${files.length} PDFs` : "PDFs"}
                        </ActionButton>
                    </ToolActions>

                    {error && (
                        <ToolResult success={false} message={error} />
                    )}

                    {result && (
                        <ToolResult
                            success
                            message={result.title}
                        />
                    )}

                    {result && mergedBlob && (
                        <div style={{ marginTop: "16px", textAlign: "center" }}>
                            <button
                                onClick={() => downloadBlob(mergedBlob, "kitbase-merged.pdf")}
                                style={{
                                    display: "inline-flex", alignItems: "center", gap: "8px",
                                    padding: "14px 28px", backgroundColor: "#34d399", color: "#0f1115",
                                    fontWeight: 600, fontSize: "15px", borderRadius: "12px",
                                    border: "none", cursor: "pointer",
                                }}
                            >
                                <Download style={{ width: "18px", height: "18px" }} /> Download Merged PDF
                            </button>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div style={{ width: "280px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div style={{ backgroundColor: "#171a21", border: "1px solid #2a2f3a", borderRadius: "16px", padding: "24px" }}>
                        <h3 style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 700, color: "#e6e8ee", margin: "0 0 16px" }}>
                            <Info style={{ width: "16px", height: "16px", color: "#4f8cff" }} />
                            How it works
                        </h3>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                            <li style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "14px", color: "#9aa0aa" }}>
                                <span style={{ color: "#4f8cff", fontWeight: 700 }}>1.</span> Upload your PDF files
                            </li>
                            <li style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "14px", color: "#9aa0aa" }}>
                                <span style={{ color: "#4f8cff", fontWeight: 700 }}>2.</span> Drag to reorder if needed
                            </li>
                            <li style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "14px", color: "#9aa0aa" }}>
                                <span style={{ color: "#4f8cff", fontWeight: 700 }}>3.</span> Click Merge and download
                            </li>
                        </ul>
                    </div>
                    <div style={{ backgroundColor: "#171a21", border: "1px solid #2a2f3a", borderRadius: "16px", padding: "24px" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#e6e8ee", margin: "0 0 16px" }}>Specifications</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                                <span style={{ color: "#6b7280" }}>Max file size</span>
                                <span style={{ color: "#9aa0aa" }}>50 MB each</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                                <span style={{ color: "#6b7280" }}>Accepted format</span>
                                <span style={{ color: "#9aa0aa" }}>.PDF</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                                <span style={{ color: "#6b7280" }}>Processing</span>
                                <span style={{ color: "#34d399" }}>Client-side</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

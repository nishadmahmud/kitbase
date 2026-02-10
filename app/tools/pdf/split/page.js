"use client";

import { useState, useCallback } from "react";
import { Scissors, Download, FileText } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolDropzone from "@/components/tool/ToolDropzone";
import ToolActions, { ActionButton } from "@/components/tool/ToolActions";
import ToolResult from "@/components/tool/ToolResult";
import { splitPdf } from "@/lib/pdf/split";
import { downloadBlob } from "@/lib/utils/download";

export default function SplitPdfPage() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [resultFiles, setResultFiles] = useState([]);
    const [error, setError] = useState(null);

    const handleFiles = useCallback((files) => {
        setFile(files[0]);
        setResultFiles([]);
        setError(null);
    }, []);

    const handleSplit = async () => {
        setLoading(true);
        setError(null);
        try {
            const files = await splitPdf(file);
            setResultFiles(files);
        } catch (e) {
            setError(e.message);
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
            <ToolHeader
                title="Split PDF"
                description="Separate one page or a whole set for easy conversion and organization."
                breadcrumbs={[{ label: "PDF Tools", href: "/category/pdf" }, { label: "Split PDF" }]}
            />
            <div style={{ maxWidth: "720px", margin: "0 auto" }}>
                {!file ? (
                    <ToolDropzone
                        onFiles={handleFiles}
                        accept=".pdf"
                        multiple={false}
                        label="Upload a PDF to split"
                        sublabel="or click to browse from your computer"
                        supportedText="Supported: .PDF (Max 50MB)"
                    />
                ) : (
                    <div>
                        <div style={{ backgroundColor: "#171a21", border: "1px solid #2a2f3a", borderRadius: "16px", padding: "20px", marginBottom: "24px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <FileText style={{ width: "20px", height: "20px", color: "#4f8cff" }} />
                                <div>
                                    <p style={{ fontSize: "14px", fontWeight: 500, color: "#e6e8ee", margin: 0 }}>{file.name}</p>
                                    <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                        </div>

                        <ToolActions>
                            <ActionButton onClick={handleSplit} loading={loading} icon={Scissors}>
                                Split All Pages
                            </ActionButton>
                            <ActionButton variant="secondary" onClick={() => { setFile(null); setResultFiles([]); }}>
                                Change File
                            </ActionButton>
                        </ToolActions>

                        {error && <ToolResult success={false} message={error} />}

                        {resultFiles.length > 0 && (
                            <div style={{ marginTop: "24px" }}>
                                <ToolResult success message={`Split into ${resultFiles.length} pages`} />
                                <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                    {resultFiles.map((f, i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", backgroundColor: "#171a21", border: "1px solid #2a2f3a", borderRadius: "12px" }}>
                                            <span style={{ fontSize: "14px", color: "#e6e8ee" }}>{f.name}</span>
                                            <button
                                                onClick={() => downloadBlob(f.blob, f.name)}
                                                style={{
                                                    display: "inline-flex", alignItems: "center", gap: "6px",
                                                    padding: "6px 12px", backgroundColor: "#1a1e27", color: "#4f8cff",
                                                    fontSize: "13px", fontWeight: 500, borderRadius: "8px",
                                                    border: "1px solid #2a2f3a", cursor: "pointer",
                                                }}
                                            >
                                                <Download style={{ width: "14px", height: "14px" }} /> Download
                                            </button>
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

"use client";

import { useState, useCallback } from "react";
import { Archive, Download, FileText } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolDropzone from "@/components/tool/ToolDropzone";
import ToolActions, { ActionButton } from "@/components/tool/ToolActions";
import ToolResult from "@/components/tool/ToolResult";
import { compressPdf } from "@/lib/pdf/compress";
import { downloadBlob } from "@/lib/utils/download";

export default function CompressPdfPage() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [resultBlob, setResultBlob] = useState(null);
    const [error, setError] = useState(null);

    const handleFiles = useCallback((files) => {
        setFile(files[0]);
        setResultBlob(null);
        setError(null);
    }, []);

    const handleCompress = async () => {
        setLoading(true);
        setError(null);
        try {
            const blob = await compressPdf(file);
            setResultBlob(blob);
        } catch (e) {
            setError(e.message);
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
            <ToolHeader
                title="Compress PDF"
                description="Optimize and reduce the file size of your PDF documents."
                breadcrumbs={[{ label: "PDF Tools", href: "/category/pdf" }, { label: "Compress PDF" }]}
            />
            <div style={{ maxWidth: "720px", margin: "0 auto" }}>
                {!file ? (
                    <ToolDropzone
                        onFiles={handleFiles}
                        accept=".pdf"
                        multiple={false}
                        label="Upload a PDF to compress"
                        sublabel="or click to browse"
                        supportedText="Supported: .PDF (Max 50MB)"
                        loading={loading}
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
                            <ActionButton onClick={handleCompress} loading={loading} icon={Archive}>
                                Optimize PDF
                            </ActionButton>
                            <ActionButton variant="secondary" onClick={() => { setFile(null); setResultBlob(null); }}>
                                Change File
                            </ActionButton>
                        </ToolActions>

                        <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "rgba(251, 191, 36, 0.1)", border: "1px solid rgba(251, 191, 36, 0.2)", borderRadius: "8px", fontSize: "13px", color: "#fbbf24" }}>
                            <strong>Note:</strong> This tool performs structural optimization. If your PDF contains large images, the size reduction might be minimal as we prioritize document integrity.
                        </div>

                        {error && <ToolResult success={false} message={error} />}

                        {resultBlob && (
                            <div style={{ marginTop: "24px" }}>
                                <ToolResult
                                    success
                                    message={`Optimized to ${(resultBlob.size / 1024 / 1024).toFixed(2)} MB`}
                                    description={
                                        resultBlob.size < file.size
                                            ? `Saved ${((file.size - resultBlob.size) / 1024 / 1024).toFixed(2)} MB (${((1 - resultBlob.size / file.size) * 100).toFixed(0)}%)`
                                            : "Already optimized."
                                    }
                                />
                                <div style={{ marginTop: "16px", textAlign: "center" }}>
                                    <button
                                        onClick={() => downloadBlob(resultBlob, `kitbase-optimized-${file.name}`)}
                                        style={{
                                            display: "inline-flex", alignItems: "center", gap: "8px",
                                            padding: "14px 28px", backgroundColor: "#34d399", color: "#0f1115",
                                            fontWeight: 600, fontSize: "15px", borderRadius: "12px",
                                            border: "none", cursor: "pointer",
                                        }}
                                    >
                                        <Download style={{ width: "18px", height: "18px" }} /> Download Optimized PDF
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

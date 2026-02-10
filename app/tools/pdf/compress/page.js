"use client";

import { useState } from "react";
import { Archive, FileText } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolDropzone from "@/components/tool/ToolDropzone";
import ToolActions, { ActionButton } from "@/components/tool/ToolActions";

export default function CompressPdfPage() {
    const [file, setFile] = useState(null);

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
            <ToolHeader
                title="Compress PDF"
                description="Reduce the file size of your PDF without losing original document quality."
                breadcrumbs={[{ label: "PDF Tools", href: "/category/pdf" }, { label: "Compress PDF" }]}
            />
            <div style={{ maxWidth: "640px", margin: "0 auto" }}>
                <ToolDropzone onFiles={(files) => setFile(files[0])} accept=".pdf" multiple={false}
                    label="Upload a PDF to compress" sublabel="or click to browse from your computer" supportedText="Supported: .PDF (Max 50MB)" />
                {file && (
                    <div style={{ marginTop: "16px", backgroundColor: "#171a21", border: "1px solid #2a2f3a", borderRadius: "16px", padding: "20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <FileText style={{ width: "20px", height: "20px", color: "#4f8cff" }} />
                            <div>
                                <p style={{ fontSize: "14px", fontWeight: 500, color: "#e6e8ee", margin: 0 }}>{file.name}</p>
                                <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>
                    </div>
                )}
                <ToolActions>
                    <ActionButton icon={Archive} disabled={!file}>Compress PDF</ActionButton>
                </ToolActions>
                <p style={{ textAlign: "center", fontSize: "14px", color: "#6b7280", marginTop: "16px" }}>Full compression functionality coming soon.</p>
            </div>
        </div>
    );
}

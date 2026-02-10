"use client";

import { useCallback, useState } from "react";
import { Upload } from "lucide-react";

export default function ToolDropzone({ onFiles, accept = "*", multiple = true, label, sublabel, supportedText }) {
    const [dragActive, setDragActive] = useState(false);

    const handleDrop = useCallback(
        (e) => {
            e.preventDefault();
            setDragActive(false);
            const files = Array.from(e.dataTransfer.files);
            if (files.length) onFiles(multiple ? files : [files[0]]);
        },
        [onFiles, multiple]
    );

    const handleChange = useCallback(
        (e) => {
            const files = Array.from(e.target.files);
            if (files.length) onFiles(multiple ? files : [files[0]]);
        },
        [onFiles, multiple]
    );

    return (
        <label
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                padding: "48px 24px", cursor: "pointer",
                border: `2px dashed ${dragActive ? "#4f8cff" : "#2a2f3a"}`,
                borderRadius: "16px",
                backgroundColor: dragActive ? "rgba(79,140,255,0.05)" : "#171a21",
                transition: "all 0.2s",
            }}
        >
            <input type="file" accept={accept} multiple={multiple} onChange={handleChange} style={{ display: "none" }} />
            <div style={{
                width: "56px", height: "56px", borderRadius: "16px",
                backgroundColor: "rgba(79,140,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "16px",
            }}>
                <Upload style={{ width: "24px", height: "24px", color: "#4f8cff" }} />
            </div>
            <p style={{ fontWeight: 600, color: "#e6e8ee", margin: "0 0 4px", fontSize: "15px" }}>
                {label || "Drag & drop files here"}
            </p>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 8px" }}>
                {sublabel || "or click to browse"}
            </p>
            {supportedText && (
                <p style={{ fontSize: "12px", color: "#4b5563", margin: 0 }}>{supportedText}</p>
            )}
        </label>
    );
}

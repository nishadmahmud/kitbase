"use client";

import { useState, useCallback } from "react";
import { Shrink, Download, Image as ImageIcon } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolDropzone from "@/components/tool/ToolDropzone";
import ToolActions, { ActionButton } from "@/components/tool/ToolActions";
import ToolSettings, { SettingRow, SettingInput } from "@/components/tool/ToolSettings";
import ToolResult from "@/components/tool/ToolResult";
import { compressImage } from "@/lib/image/compress";
import { downloadBlob } from "@/lib/utils/download";

export default function CompressImagePage() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [maxSizeMB, setMaxSizeMB] = useState(0.5);
    const [maxWidth, setMaxWidth] = useState(1920);
    const [loading, setLoading] = useState(false);
    const [resultBlob, setResultBlob] = useState(null);
    const [error, setError] = useState(null);

    const handleFiles = useCallback((files) => {
        const f = files[0];
        setFile(f);
        setResultBlob(null);
        setError(null);
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(f);
    }, []);

    const handleCompress = async () => {
        setLoading(true);
        setError(null);
        try {
            const blob = await compressImage(file, { maxSizeMB, maxWidthOrHeight: maxWidth });
            setResultBlob(blob);
        } catch (e) {
            setError(e.message);
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
            <ToolHeader
                title="Compress Image"
                description="Reduce file size of JPG, PNG, and WebP without losing quality."
                breadcrumbs={[{ label: "Image Tools", href: "/category/image" }, { label: "Compress Image" }]}
            />
            <div style={{ maxWidth: "720px", margin: "0 auto" }}>
                {!file ? (
                    <ToolDropzone
                        onFiles={handleFiles}
                        accept="image/*"
                        multiple={false}
                        label="Upload an image to compress"
                        sublabel="or click to browse from your computer"
                        supportedText="Supported: JPG, PNG, WebP (Max 20MB)"
                    />
                ) : (
                    <div>
                        {/* Preview */}
                        <div style={{ backgroundColor: "#171a21", border: "1px solid #2a2f3a", borderRadius: "16px", padding: "16px", marginBottom: "24px" }}>
                            <img
                                src={preview}
                                alt="Preview"
                                style={{ maxWidth: "100%", maxHeight: "300px", display: "block", margin: "0 auto", borderRadius: "8px" }}
                            />
                            <p style={{ textAlign: "center", fontSize: "13px", color: "#6b7280", marginTop: "12px", marginBottom: 0 }}>
                                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                        </div>

                        {/* Settings */}
                        <ToolSettings>
                            <SettingRow label="Max Size (MB)">
                                <SettingInput type="number" value={maxSizeMB} onChange={(e) => setMaxSizeMB(parseFloat(e.target.value))} min={0.01} max={50} step={0.1} />
                            </SettingRow>
                            <SettingRow label="Max Width/Height (px)">
                                <SettingInput type="number" value={maxWidth} onChange={(e) => setMaxWidth(parseInt(e.target.value))} min={100} max={8000} step={100} />
                            </SettingRow>
                        </ToolSettings>

                        <ToolActions>
                            <ActionButton onClick={handleCompress} loading={loading} icon={Shrink}>
                                Compress Image
                            </ActionButton>
                            <ActionButton variant="secondary" onClick={() => { setFile(null); setPreview(null); setResultBlob(null); }}>
                                Change Image
                            </ActionButton>
                        </ToolActions>

                        {error && <ToolResult success={false} message={error} />}

                        {resultBlob && (
                            <div style={{ marginTop: "24px" }}>
                                <ToolResult
                                    success
                                    message={`Compressed to ${(resultBlob.size / 1024 / 1024).toFixed(2)} MB`}
                                    description={`Saved ${((file.size - resultBlob.size) / 1024 / 1024).toFixed(2)} MB (${((1 - resultBlob.size / file.size) * 100).toFixed(0)}%)`}
                                />
                                <div style={{ marginTop: "16px", textAlign: "center" }}>
                                    <button
                                        onClick={() => downloadBlob(resultBlob, `kitbase-compressed-${file.name}`)}
                                        style={{
                                            display: "inline-flex", alignItems: "center", gap: "8px",
                                            padding: "14px 28px", backgroundColor: "#34d399", color: "#0f1115",
                                            fontWeight: 600, fontSize: "15px", borderRadius: "12px",
                                            border: "none", cursor: "pointer",
                                        }}
                                    >
                                        <Download style={{ width: "18px", height: "18px" }} /> Download
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

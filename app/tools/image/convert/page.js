"use client";

import { useState, useCallback } from "react";
import { RefreshCw, Download, Image as ImageIcon } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolDropzone from "@/components/tool/ToolDropzone";
import ToolActions, { ActionButton } from "@/components/tool/ToolActions";
import ToolSettings, { SettingRow, SettingSelect, SettingInput } from "@/components/tool/ToolSettings";
import ToolResult from "@/components/tool/ToolResult";
import { convertImage } from "@/lib/image/convert";
import { downloadBlob } from "@/lib/utils/download";

export default function ConvertImagePage() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [format, setFormat] = useState("image/png");
    const [quality, setQuality] = useState(0.92);
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

    const handleConvert = async () => {
        setLoading(true);
        setError(null);
        try {
            const blob = await convertImage(file, format, quality);
            setResultBlob(blob);
        } catch (e) {
            setError(e.message);
        }
        setLoading(false);
    };

    const ext = format === "image/png" ? "png" : format === "image/webp" ? "webp" : "jpg";

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
            <ToolHeader
                title="Convert Image"
                description="Convert images between JPG, PNG, WebP, and other formats instantly."
                breadcrumbs={[{ label: "Image Tools", href: "/category/image" }, { label: "Convert Image" }]}
            />
            <div style={{ maxWidth: "720px", margin: "0 auto" }}>
                {!file ? (
                    <ToolDropzone
                        onFiles={handleFiles}
                        accept="image/*"
                        multiple={false}
                        label="Upload an image to convert"
                        sublabel="or click to browse from your computer"
                        supportedText="Supported: JPG, PNG, WebP, GIF, BMP"
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
                            <SettingRow label="Target Format">
                                <SettingSelect
                                    value={format}
                                    onChange={(e) => setFormat(e.target.value)}
                                    options={[
                                        { value: "image/png", label: "PNG" },
                                        { value: "image/jpeg", label: "JPEG" },
                                        { value: "image/webp", label: "WebP" },
                                    ]}
                                />
                            </SettingRow>
                            {format !== "image/png" && (
                                <SettingRow label="Quality (0.1 - 1.0)">
                                    <SettingInput type="number" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} min={0.1} max={1} step={0.05} />
                                </SettingRow>
                            )}
                        </ToolSettings>

                        <ToolActions>
                            <ActionButton onClick={handleConvert} loading={loading} icon={RefreshCw}>
                                Convert to {ext.toUpperCase()}
                            </ActionButton>
                            <ActionButton variant="secondary" onClick={() => { setFile(null); setPreview(null); setResultBlob(null); }}>
                                Change Image
                            </ActionButton>
                        </ToolActions>

                        {error && <ToolResult success={false} message={error} />}

                        {resultBlob && (
                            <div style={{ marginTop: "24px" }}>
                                <ToolResult success message={`Converted to ${ext.toUpperCase()}`} />
                                <div style={{ marginTop: "16px", textAlign: "center" }}>
                                    <button
                                        onClick={() => downloadBlob(resultBlob, `kitbase-converted.${ext}`)}
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

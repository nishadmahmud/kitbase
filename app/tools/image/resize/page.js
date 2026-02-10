"use client";

import { useState, useCallback } from "react";
import { Image as ImageIcon, Download } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolDropzone from "@/components/tool/ToolDropzone";
import ToolActions, { ActionButton } from "@/components/tool/ToolActions";
import ToolSettings, { SettingRow, SettingInput, SettingSelect } from "@/components/tool/ToolSettings";
import ToolResult from "@/components/tool/ToolResult";
import { resizeImage } from "@/lib/image/resize";
import { downloadDataUrl } from "@/lib/utils/download";

export default function ResizeImagePage() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [width, setWidth] = useState(800);
    const [height, setHeight] = useState(600);
    const [maintainAspect, setMaintainAspect] = useState(true);
    const [format, setFormat] = useState("image/png");
    const [quality, setQuality] = useState(0.92);
    const [loading, setLoading] = useState(false);
    const [resultUrl, setResultUrl] = useState(null);
    const [error, setError] = useState(null);
    const [origDims, setOrigDims] = useState(null);

    const handleFiles = useCallback((files) => {
        const f = files[0];
        setFile(f);
        setResultUrl(null);
        setError(null);
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target.result);
            const img = new window.Image();
            img.onload = () => {
                setOrigDims({ w: img.naturalWidth, h: img.naturalHeight });
                setWidth(img.naturalWidth);
                setHeight(img.naturalHeight);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(f);
    }, []);

    const handleWidthChange = (e) => {
        const w = parseInt(e.target.value) || 0;
        setWidth(w);
        if (maintainAspect && origDims) {
            setHeight(Math.round((w / origDims.w) * origDims.h));
        }
    };

    const handleHeightChange = (e) => {
        const h = parseInt(e.target.value) || 0;
        setHeight(h);
        if (maintainAspect && origDims) {
            setWidth(Math.round((h / origDims.h) * origDims.w));
        }
    };

    const handleResize = async () => {
        setLoading(true);
        setError(null);
        try {
            const dataUrl = await resizeImage(file, { width, height, format, quality });
            setResultUrl(dataUrl);
        } catch (e) {
            setError(e.message);
        }
        setLoading(false);
    };

    const ext = format === "image/png" ? "png" : format === "image/webp" ? "webp" : "jpg";

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
            <ToolHeader
                title="Resize Image"
                description="Change image dimensions while maintaining quality and aspect ratio."
                breadcrumbs={[{ label: "Image Tools", href: "/category/image" }, { label: "Resize Image" }]}
            />
            <div style={{ maxWidth: "720px", margin: "0 auto" }}>
                {!file ? (
                    <ToolDropzone
                        onFiles={handleFiles}
                        accept="image/*"
                        multiple={false}
                        label="Upload an image to resize"
                        sublabel="or click to browse from your computer"
                        supportedText="Supported: JPG, PNG, WebP, GIF (Max 20MB)"
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
                                {file.name} · {origDims ? `${origDims.w}×${origDims.h}` : ""}
                            </p>
                        </div>

                        {/* Settings */}
                        <ToolSettings>
                            <SettingRow label="Width (px)">
                                <SettingInput value={width} onChange={handleWidthChange} min={1} />
                            </SettingRow>
                            <SettingRow label="Height (px)">
                                <SettingInput value={height} onChange={handleHeightChange} min={1} />
                            </SettingRow>
                            <SettingRow label="Keep aspect ratio">
                                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                                    <input
                                        type="checkbox"
                                        checked={maintainAspect}
                                        onChange={(e) => setMaintainAspect(e.target.checked)}
                                        style={{ accentColor: "#4f8cff", width: "18px", height: "18px" }}
                                    />
                                    <span style={{ fontSize: "13px", color: "#9aa0aa" }}>{maintainAspect ? "Yes" : "No"}</span>
                                </label>
                            </SettingRow>
                            <SettingRow label="Format">
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
                                <SettingRow label="Quality">
                                    <SettingInput type="number" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} min={0.1} max={1} step={0.05} />
                                </SettingRow>
                            )}
                        </ToolSettings>

                        <ToolActions>
                            <ActionButton onClick={handleResize} loading={loading} icon={ImageIcon}>
                                Resize to {width}×{height}
                            </ActionButton>
                            <ActionButton variant="secondary" onClick={() => { setFile(null); setPreview(null); setResultUrl(null); }}>
                                Change Image
                            </ActionButton>
                        </ToolActions>

                        {error && <ToolResult success={false} message={error} />}

                        {resultUrl && (
                            <div style={{ marginTop: "24px" }}>
                                <ToolResult success message={`Resized to ${width}×${height} as ${ext.toUpperCase()}`} />
                                <div style={{ marginTop: "16px", backgroundColor: "#171a21", border: "1px solid #2a2f3a", borderRadius: "16px", padding: "16px" }}>
                                    <img src={resultUrl} alt="Resized" style={{ maxWidth: "100%", maxHeight: "300px", display: "block", margin: "0 auto", borderRadius: "8px" }} />
                                </div>
                                <div style={{ marginTop: "16px", textAlign: "center" }}>
                                    <button
                                        onClick={() => downloadDataUrl(resultUrl, `kitbase-resized.${ext}`)}
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

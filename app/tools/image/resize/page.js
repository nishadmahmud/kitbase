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
        <div className="max-w-[1280px] mx-auto px-6 py-10">
            <ToolHeader
                title="Resize Image"
                description="Change image dimensions while maintaining quality and aspect ratio."
                breadcrumbs={[{ label: "Image Tools", href: "/category/image" }, { label: "Resize Image" }]}
            />
            <div className="max-w-7xl mx-auto">
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
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Sidebar: Settings & Actions */}
                        <div className="w-full md:w-[320px] flex-shrink-0 flex flex-col gap-6">
                            <ToolSettings>
                                <SettingRow label="Width (px)">
                                    <SettingInput value={width} onChange={handleWidthChange} min={1} />
                                </SettingRow>
                                <SettingRow label="Height (px)">
                                    <SettingInput value={height} onChange={handleHeightChange} min={1} />
                                </SettingRow>
                                <SettingRow label="Keep aspect ratio">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={maintainAspect}
                                            onChange={(e) => setMaintainAspect(e.target.checked)}
                                            className="accent-gray-200 w-[18px] h-[18px]"
                                        />
                                        <span className="text-[13px] text-gray-400">{maintainAspect ? "Yes" : "No"}</span>
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
                                <ActionButton onClick={handleResize} loading={loading} icon={ImageIcon} fullWidth>
                                    Resize to {width}×{height}
                                </ActionButton>
                                <ActionButton variant="secondary" onClick={() => { setFile(null); setPreview(null); setResultUrl(null); }} fullWidth>
                                    Change Image
                                </ActionButton>
                            </ToolActions>
                        </div>

                        {/* Main: Preview & Result */}
                        <div className="flex-1 min-w-0 flex flex-col gap-6 w-full">
                            {/* Preview */}
                            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[300px]">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="max-w-full max-h-[500px] object-contain rounded-lg"
                                />
                                <p className="text-center text-[13px] text-gray-500 mt-4 m-0">
                                    Original: {file.name} · {origDims ? `${origDims.w}×${origDims.h}` : ""}
                                </p>
                            </div>

                            {error && <ToolResult success={false} message={error} />}

                            {resultUrl && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-sm font-semibold text-gray-400 uppercase m-0">Resized Result</h3>
                                            <span className="text-xs font-mono text-gray-500">{width}×{height}</span>
                                        </div>

                                        <div className="flex flex-col items-center gap-6">
                                            <img src={resultUrl} alt="Resized" className="max-w-full max-h-[500px] object-contain rounded-lg shadow-2xl" />

                                            <button
                                                onClick={() => downloadDataUrl(resultUrl, `kitbase-resized.${ext}`)}
                                                className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-500 text-gray-950 font-semibold text-sm rounded-xl border-none cursor-pointer hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
                                            >
                                                <Download className="w-4 h-4" /> Download Resized Image
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

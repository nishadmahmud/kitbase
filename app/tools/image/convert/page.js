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
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950 pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="Convert Image"
                    description="Convert images between JPG, PNG, WebP, and other formats instantly."
                    breadcrumbs={[{ label: "Image Tools", href: "/category/image" }, { label: "Convert Image" }]}
                />
            </div>
            <div className="max-w-7xl mx-auto">
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
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Sidebar */}
                        <div className="w-full md:w-[320px] flex-shrink-0 flex flex-col gap-6">
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
                                <ActionButton onClick={handleConvert} loading={loading} icon={RefreshCw} fullWidth>
                                    Convert to {ext.toUpperCase()}
                                </ActionButton>
                                <ActionButton variant="secondary" onClick={() => { setFile(null); setPreview(null); setResultBlob(null); }} fullWidth>
                                    Change Image
                                </ActionButton>
                            </ToolActions>
                        </div>

                        {/* Main */}
                        <div className="flex-1 min-w-0 flex flex-col gap-6 w-full">
                            {/* Preview */}
                            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[300px] shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="max-w-full max-h-[500px] object-contain rounded-lg"
                                />
                                <p className="text-center text-[13px] text-gray-500 mt-4 m-0">
                                    Original: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </p>
                            </div>

                            {error && <ToolResult success={false} message={error} />}

                            {resultBlob && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 text-center shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase m-0">Conversion Complete</h3>
                                            <span className="text-xs font-mono text-gray-500">{ext.toUpperCase()}</span>
                                        </div>
                                        <ToolResult success message={`Successfully converted to ${ext.toUpperCase()}`} />

                                        <div className="mt-6 flex justify-center">
                                            <button
                                                onClick={() => downloadBlob(resultBlob, `kitbase-converted.${ext}`)}
                                                className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-500 text-white dark:text-gray-950 font-semibold text-sm rounded-xl border-none cursor-pointer hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
                                            >
                                                <Download className="w-4 h-4" /> Download Converted Image
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

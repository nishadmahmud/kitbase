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
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950 pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="Compress Image"
                    description="Reduce file size of JPG, PNG, and WebP without losing quality."
                    breadcrumbs={[{ label: "Image Tools", href: "/category/image" }, { label: "Compress Image" }]}
                />
            </div>
            <div className="max-w-7xl mx-auto">
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
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Sidebar */}
                        <div className="w-full md:w-[320px] flex-shrink-0 flex flex-col gap-6">
                            <ToolSettings>
                                <SettingRow label="Max Size (MB)">
                                    <SettingInput type="number" value={maxSizeMB} onChange={(e) => setMaxSizeMB(parseFloat(e.target.value))} min={0.01} max={50} step={0.1} />
                                </SettingRow>
                                <SettingRow label="Max Width/Height (px)">
                                    <SettingInput type="number" value={maxWidth} onChange={(e) => setMaxWidth(parseInt(e.target.value))} min={100} max={8000} step={100} />
                                </SettingRow>
                            </ToolSettings>

                            <ToolActions>
                                <ActionButton onClick={handleCompress} loading={loading} icon={Shrink} fullWidth>
                                    Compress Image
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
                                    <ToolResult
                                        success
                                        message={`Compressed to ${(resultBlob.size / 1024 / 1024).toFixed(2)} MB`}
                                        description={`Saved ${((file.size - resultBlob.size) / 1024 / 1024).toFixed(2)} MB (${((1 - resultBlob.size / file.size) * 100).toFixed(0)}%)`}
                                    />
                                    <div className="mt-4 text-center">
                                        <button
                                            onClick={() => downloadBlob(resultBlob, `kitbase-compressed-${file.name}`)}
                                            className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-500 text-white dark:text-gray-950 font-semibold text-sm rounded-xl border-none cursor-pointer hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
                                        >
                                            <Download className="w-4 h-4" /> Download Compressed Image
                                        </button>
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

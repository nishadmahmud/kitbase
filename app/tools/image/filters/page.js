"use client";

import { useState, useRef, useEffect } from "react";
import { Sliders, Download, RotateCcw } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolDropzone from "@/components/tool/ToolDropzone";
import ToolActions, { ActionButton } from "@/components/tool/ToolActions";
import { downloadDataUrl } from "@/lib/utils/download";

const FILTERS = [
    { id: "brightness", label: "Brightness", min: 0, max: 200, default: 100, unit: "%" },
    { id: "contrast", label: "Contrast", min: 0, max: 200, default: 100, unit: "%" },
    { id: "saturation", label: "Saturation", min: 0, max: 200, default: 100, unit: "%" },
    { id: "grayscale", label: "Grayscale", min: 0, max: 100, default: 0, unit: "%" },
    { id: "sepia", label: "Sepia", min: 0, max: 100, default: 0, unit: "%" },
    { id: "blur", label: "Blur", min: 0, max: 20, default: 0, unit: "px" },
    { id: "hue-rotate", label: "Hue Rotate", min: 0, max: 360, default: 0, unit: "deg" },
];

export default function ImageFiltersPage() {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [settings, setSettings] = useState({});

    const canvasRef = useRef(null);
    const imageRef = useRef(null);

    // Initialize settings
    useEffect(() => {
        const defaults = {};
        FILTERS.forEach(f => defaults[f.id] = f.default);
        setSettings(defaults);
    }, []);

    const handleFiles = (files) => {
        const f = files[0];
        setFile(f);
        const url = URL.createObjectURL(f);
        setPreviewUrl(url);
        // Reset settings
        const defaults = {};
        FILTERS.forEach(f => defaults[f.id] = f.default);
        setSettings(defaults);
    };

    const updateSetting = (id, value) => {
        setSettings(prev => ({ ...prev, [id]: value }));
    };

    const getFilterString = () => {
        return `
            brightness(${settings.brightness}%) 
            contrast(${settings.contrast}%) 
            saturate(${settings.saturation}%) 
            grayscale(${settings.grayscale}%) 
            sepia(${settings.sepia}%) 
            blur(${settings.blur}px) 
            hue-rotate(${settings['hue-rotate']}deg)
        `;
    };

    // Apply filters to canvas for download
    const downloadImage = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const img = imageRef.current;

        if (!img || !canvas) return;

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        ctx.filter = getFilterString();
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL(file.type);
        downloadDataUrl(dataUrl, `filtered-${file.name}`);
    };

    return (
        <div className="min-h-screen pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="Image Filters"
                    description="Enhance your photos with adjustable brightness, contrast, and artistic effects."
                    breadcrumbs={[{ label: "Image Tools", href: "/category/image" }, { label: "Filters" }]}
                />
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="max-w-7xl mx-auto">
                {!file ? (
                    <ToolDropzone
                        onFiles={handleFiles}
                        accept="image/*"
                        multiple={false}
                        label="Upload image to edit"
                        supportedText="Supported: JPG, PNG, WebP"
                    />
                ) : (
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Controls */}
                        <div className="w-full md:w-[320px] flex-shrink-0 flex flex-col gap-6">
                            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-2 m-0">
                                        <Sliders size={16} /> Adjustments
                                    </h3>
                                    <button
                                        onClick={() => {
                                            const defaults = {};
                                            FILTERS.forEach(f => defaults[f.id] = f.default);
                                            setSettings(defaults);
                                        }}
                                        className="text-red-500 bg-transparent border-none cursor-pointer flex items-center gap-1 text-xs font-medium hover:text-red-400 transition-colors"
                                    >
                                        <RotateCcw size={12} /> Reset
                                    </button>
                                </div>

                                <div className="flex flex-col gap-6">
                                    {FILTERS.map(filter => (
                                        <div key={filter.id} className="flex flex-col gap-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm text-gray-700 dark:text-gray-200 font-medium">{filter.label}</label>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{settings[filter.id]}{filter.unit}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min={filter.min}
                                                max={filter.max}
                                                value={settings[filter.id] || filter.default}
                                                onChange={(e) => updateSetting(filter.id, Number(e.target.value))}
                                                className="w-full cursor-pointer accent-blue-600 dark:accent-gray-200 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <ToolActions>
                                <ActionButton onClick={downloadImage} icon={Download} fullWidth>Download Image</ActionButton>
                                <ActionButton variant="secondary" onClick={() => { setFile(null); setPreviewUrl(null); }} fullWidth>Change Image</ActionButton>
                            </ToolActions>
                        </div>

                        {/* Preview */}
                        <div className="flex-1 min-w-0 w-full bg-gray-100 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden flex items-center justify-center min-h-[500px] p-6 shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                            <img
                                ref={imageRef}
                                src={previewUrl}
                                alt="Preview"
                                className="max-w-full max-h-[600px] object-contain transition-all duration-100 ease-linear block"
                                style={{
                                    filter: getFilterString()
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

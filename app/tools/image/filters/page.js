"use client";

import { useState, useRef, useEffect } from "react";
import { Sliders, Download, RotateCcw, Image as ImageIcon, Sparkles } from "lucide-react";
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
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
            <ToolHeader
                title="Image Filters"
                description="Enhance your photos with adjustable brightness, contrast, and artistic effects."
                breadcrumbs={[{ label: "Image Tools", href: "/category/image" }, { label: "Filters" }]}
            />

            <canvas ref={canvasRef} style={{ display: "none" }} />

            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                {!file ? (
                    <ToolDropzone
                        onFiles={handleFiles}
                        accept="image/*"
                        multiple={false}
                        label="Upload image to edit"
                        supportedText="Supported: JPG, PNG, WebP"
                    />
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "32px", alignItems: "start" }}>
                        {/* Controls */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                            <div style={{ backgroundColor: "#171a21", border: "1px solid #2a2f3a", borderRadius: "16px", padding: "20px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                    <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#9aa0aa", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                                        <Sliders size={16} /> Adjustments
                                    </h3>
                                    <button
                                        onClick={() => {
                                            const defaults = {};
                                            FILTERS.forEach(f => defaults[f.id] = f.default);
                                            setSettings(defaults);
                                        }}
                                        style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 500 }}
                                    >
                                        <RotateCcw size={12} /> Reset
                                    </button>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                    {FILTERS.map(filter => (
                                        <div key={filter.id}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                                <label style={{ fontSize: "13px", color: "#e6e8ee", fontWeight: 500 }}>{filter.label}</label>
                                                <span style={{ fontSize: "12px", color: "#9aa0aa" }}>{settings[filter.id]}{filter.unit}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min={filter.min}
                                                max={filter.max}
                                                value={settings[filter.id] || filter.default}
                                                onChange={(e) => updateSetting(filter.id, Number(e.target.value))}
                                                style={{ width: "100%", cursor: "pointer", accentColor: "#4f8cff" }}
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
                        <div style={{
                            backgroundColor: "#111", border: "1px solid #2a2f3a", borderRadius: "16px", overflow: "hidden",
                            display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px", padding: "20px"
                        }}>
                            <img
                                ref={imageRef}
                                src={previewUrl}
                                alt="Preview"
                                style={{
                                    maxWidth: "100%", maxHeight: "600px", objectFit: "contain",
                                    filter: getFilterString(),
                                    transition: "filter 0.1s linear"
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import { Stamp, FileUp, Download, X, Settings2 } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolDropzone from "@/components/tool/ToolDropzone";
import { cn } from "@/lib/utils/cn";

export default function WatermarkPdfPage() {
    const [file, setFile] = useState(null);
    const [text, setText] = useState("CONFIDENTIAL");
    const [size, setSize] = useState(50);
    const [opacity, setOpacity] = useState(0.5);
    const [rotation, setRotation] = useState(45);
    const [color, setColor] = useState("#FF0000");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileSelect = (files) => {
        if (files?.[0]) {
            setFile(files[0]);
        }
    };

    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? rgb(
                parseInt(result[1], 16) / 255,
                parseInt(result[2], 16) / 255,
                parseInt(result[3], 16) / 255
            )
            : rgb(0, 0, 0);
    };

    const handleWatermark = async () => {
        if (!file) return;

        try {
            setIsProcessing(true);
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            const watermarkColor = hexToRgb(color);

            const pages = pdfDoc.getPages();
            pages.forEach((page) => {
                const { width, height } = page.getSize();
                const textWidth = font.widthOfTextAtSize(text, size);
                const textHeight = font.heightAtSize(size);

                // Simple center positioning for now
                // Improving placement logic would require more complex math for rotation
                page.drawText(text, {
                    x: width / 2 - textWidth / 2,
                    y: height / 2,
                    size: size,
                    font: font,
                    color: watermarkColor,
                    opacity: opacity,
                    rotate: degrees(rotation),
                    // Centering with rotation is tricky in pdf-lib without calculating bounding box
                    // For MVP, we draw at center coordinates.
                    x: width / 2 - (textWidth / 2) * Math.cos(rotation * (Math.PI / 180)),
                    y: height / 2 - (textWidth / 2) * Math.sin(rotation * (Math.PI / 180)),
                    // Simplified: Just draw at center
                    // Actually, pdf-lib rotates around the anchor point (bottom-left of text).
                    // To center rotated text, it's involved. 
                    // Let's stick to standard draw and maybe adjust visual center manually if needed or just accept it's "near center".
                });

                // Let's use a standard "diagonal across page" approach if rotation is 45
                // Or just basic centering.

                // Re-doing simple draw to be safe
                page.drawText(text, {
                    x: width / 2 - textWidth / 2,
                    y: height / 2 - textHeight / 2,
                    size,
                    font,
                    color: watermarkColor,
                    opacity,
                    rotate: degrees(rotation),
                });
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            saveAs(blob, `watermarked-${file.name}`);
        } catch (err) {
            console.error(err);
            alert("Failed to add watermark.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 pb-12">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="Watermark PDF"
                    description="Stamp text overlays onto your PDF documents."
                />
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10 flex flex-col gap-8">

                {/* Upload Section */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-lg">
                    {!file ? (
                        <ToolDropzone
                            onFilesSelected={handleFileSelect}
                            accept={{ "application/pdf": [".pdf"] }}
                            title="Click or drag PDF to watermark"
                        />
                    ) : (
                        <div className="flex items-center gap-4 p-4 bg-gray-950 border border-gray-800 rounded-xl relative group">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-500 flex-shrink-0">
                                <FileUp size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-200 truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button
                                onClick={() => setFile(null)}
                                className="text-gray-500 hover:text-purple-400 p-2 rounded-lg hover:bg-gray-900 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Settings Section */}
                {file && (
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-bold text-gray-200 mb-6 flex items-center gap-2">
                                    <Settings2 size={20} className="text-purple-500" /> Settings
                                </h3>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                            Watermark Text
                                        </label>
                                        <input
                                            type="text"
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-gray-200 outline-none focus:border-purple-500/50 transition-colors"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                                Size (px)
                                            </label>
                                            <input
                                                type="number"
                                                value={size}
                                                onChange={(e) => setSize(Number(e.target.value))}
                                                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-gray-200 outline-none focus:border-purple-500/50 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                                Rotation (deg)
                                            </label>
                                            <input
                                                type="number"
                                                value={rotation}
                                                onChange={(e) => setRotation(Number(e.target.value))}
                                                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-gray-200 outline-none focus:border-purple-500/50 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                                Opacity ({Math.round(opacity * 100)}%)
                                            </label>
                                            <input
                                                type="range"
                                                min="0.1"
                                                max="1"
                                                step="0.1"
                                                value={opacity}
                                                onChange={(e) => setOpacity(Number(e.target.value))}
                                                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                                Color
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={color}
                                                    onChange={(e) => setColor(e.target.value)}
                                                    className="w-8 h-8 rounded-lg border-none bg-transparent cursor-pointer"
                                                />
                                                <span className="text-gray-400 text-sm font-mono">{color}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col justify-center items-center bg-gray-950 rounded-xl border border-gray-800/50 p-8">
                                {/* Simple Visual Preview (HTML/CSS Approximation) */}
                                <div
                                    className="w-48 h-64 bg-white relative flex items-center justify-center overflow-hidden shadow-2xl"
                                    style={{ opacity: 0.9 }}
                                >
                                    <div className="absolute inset-4 border border-gray-200 border-dashed"></div>
                                    <span
                                        style={{
                                            color: color,
                                            opacity: opacity,
                                            fontSize: `${size / 3}px`, // Scaled down for preview
                                            transform: `rotate(${rotation}deg)`,
                                            whiteSpace: "nowrap",
                                            fontWeight: "bold",
                                            fontFamily: "sans-serif"
                                        }}
                                    >
                                        {text}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-4">Approximate Preview</p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-800">
                            <button
                                onClick={handleWatermark}
                                disabled={isProcessing}
                                className={cn(
                                    "w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all",
                                    isProcessing
                                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                                        : "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20 hover:scale-[1.02]"
                                )}
                            >
                                {isProcessing ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        <Download size={18} /> Add Watermark & Download
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

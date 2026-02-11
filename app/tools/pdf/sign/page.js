"use client";

import { useState, useRef, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { PenTool, FileUp, Download, X, Type, Image as ImageIcon, Eraser, ChevronLeft, ChevronRight, Move } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolDropzone from "@/components/tool/ToolDropzone";
import { cn } from "@/lib/utils/cn";
import { renderPdfPages } from "@/lib/pdf/render";

export default function SignPdfPage() {
    const [file, setFile] = useState(null);
    const [pages, setPages] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isRendering, setIsRendering] = useState(false);
    const [signature, setSignature] = useState(null); // Data URL
    const [sigType, setSigType] = useState("draw"); // draw, type, upload

    // Position defaults to center-ish
    const [position, setPosition] = useState({ x: 20, y: 20 }); // Percentage 0-100
    const [sigScale, setSigScale] = useState(1);

    // Drawing
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    // Typing
    const [typedName, setTypedName] = useState("");
    const [typedFont, setTypedFont] = useState("cursive"); // 'cursive', 'serif', 'sans-serif'

    const handleFileSelect = async (files) => {
        if (files?.[0]) {
            setFile(files[0]);
            setIsRendering(true);
            try {
                // Render just the first few pages or all? Let's render all for navigation
                // For large PDFs this might be slow. Let's do lazy loading in a real app,
                // but for this MVP tool, render all (usually strictly limits user to small docs).
                // Or better: Render on demand. `renderPdfPages` renders all.
                // Let's stick to render all for simplicity with the existing util.
                const imgs = await renderPdfPages(files[0], { scale: 1.5 });
                setPages(imgs);
            } catch (e) {
                console.error(e);
                alert("Failed to render PDF. It might be password protected.");
                setFile(null);
            } finally {
                setIsRendering(false);
            }
        }
    };

    // Draw Logic
    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000";

        const { offsetX, offsetY } = getCoordinates(e, canvas);
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const { offsetX, offsetY } = getCoordinates(e, canvas);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const getCoordinates = (e, canvas) => {
        if (e.touches) {
            const rect = canvas.getBoundingClientRect();
            return {
                offsetX: e.touches[0].clientX - rect.left,
                offsetY: e.touches[0].clientY - rect.top
            };
        }
        return {
            offsetX: e.nativeEvent.offsetX,
            offsetY: e.nativeEvent.offsetY
        };
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignature(null);
    };

    const saveDrawing = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            setSignature(canvas.toDataURL("image/png"));
        }
    };

    // Typing Logic
    useEffect(() => {
        if (sigType === "type" && typedName) {
            // Generate simple signature from text
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = 400;
            canvas.height = 100;
            ctx.font = `italic 48px ${typedFont === 'cursive' ? 'Brush Script MT, cursive' : typedFont}`;
            ctx.fillStyle = "#000";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(typedName, canvas.width / 2, canvas.height / 2);
            setSignature(canvas.toDataURL("image/png"));
        }
    }, [typedName, typedFont, sigType]);

    // Upload Logic
    const handleSigUpload = (e) => {
        const f = e.target.files[0];
        if (f) {
            const reader = new FileReader();
            reader.onload = (ev) => setSignature(ev.target.result);
            reader.readAsDataURL(f);
        }
    };

    // Placement Logic
    const containerRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const [isSelected, setIsSelected] = useState(false); // Track selection for deletion

    // Click to Place
    const handleCanvasClick = (e) => {
        if (dragging || !containerRef.current || !signature) return;

        // If we clicked the canvas (not the signature), deselect
        setIsSelected(false);

        // processing click
        const container = containerRef.current.getBoundingClientRect();
        let clientX = e.clientX;
        let clientY = e.clientY;

        // Calculate relative position 
        let x = clientX - container.left;
        let y = clientY - container.top;

        // Constrain
        x = Math.max(0, Math.min(x, container.width));
        y = Math.max(0, Math.min(y, container.height));

        setPosition({
            x: (x / container.width) * 100,
            y: (y / container.height) * 100
        });
    };

    const handleDragStart = (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent triggering click-to-place
        setDragging(true);
        setIsSelected(true); // Select when dragging starts
    };

    // Window-based drag handling for robustness
    useEffect(() => {
        if (!dragging) return;

        const handleWindowMove = (e) => {
            if (!containerRef.current) return;

            const container = containerRef.current.getBoundingClientRect();
            let clientX = e.clientX;
            let clientY = e.clientY;

            if (e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            }

            let x = clientX - container.left;
            let y = clientY - container.top;

            // Constrain
            x = Math.max(0, Math.min(x, container.width));
            y = Math.max(0, Math.min(y, container.height));

            setPosition({
                x: (x / container.width) * 100,
                y: (y / container.height) * 100
            });
        };

        const handleWindowUp = () => {
            setDragging(false);
        };

        window.addEventListener("mousemove", handleWindowMove);
        window.addEventListener("mouseup", handleWindowUp);
        window.addEventListener("touchmove", handleWindowMove, { passive: false });
        window.addEventListener("touchend", handleWindowUp);

        return () => {
            window.removeEventListener("mousemove", handleWindowMove);
            window.removeEventListener("mouseup", handleWindowUp);
            window.removeEventListener("touchmove", handleWindowMove);
            window.removeEventListener("touchend", handleWindowUp);
        };
    }, [dragging]);

    // Keyboard Deletion
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!signature || !isSelected) return;

            // Delete or Backspace
            if (e.key === "Delete" || e.key === "Backspace") {
                // Check if we are not in an input/textarea
                if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") return;

                e.preventDefault();
                setSignature(null);
                setIsSelected(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [signature, isSelected]);


    // Signing Process
    const processPdf = async () => {
        if (!file || !signature) return;

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const sigImage = await pdfDoc.embedPng(signature);

            const page = pdfDoc.getPages()[currentPage];
            const { width, height } = page.getSize();

            // Calculate position
            // Position x/y are percentages of the VIEW container.
            // We need to map that to PDF coordinates.
            const pdfX = (position.x / 100) * width;
            // PDF Y is from bottom, DOM Y is from top.
            const pdfY = height - ((position.y / 100) * height);

            // Scale signature
            const sigDims = sigImage.scale(0.5 * sigScale); // Base scale + user scale

            // Page.drawImage draws from bottom-left origin by default? 
            // pdf-lib drawImage: x,y is bottom-left of image.

            // Our position is center of the signature in the UI (translate -50%, -50%).
            // So we need to subtract half width/height to get bottom-left corner relative to that center point.

            page.drawImage(sigImage, {
                x: pdfX - (sigDims.width / 2),
                y: pdfY - (sigDims.height / 2),
                width: sigDims.width,
                height: sigDims.height,
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            saveAs(blob, `signed-${file.name}`);
        } catch (err) {
            console.error(err);
            alert("Failed to sign PDF (PNG signatures only supported for now).");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950 pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="Sign PDF"
                    description="Visually sign your PDF documents with your own signature."
                />
            </div>

            <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-10 flex flex-col gap-8">

                {/* 1. Upload */}
                {!file && (
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                        <ToolDropzone
                            onFiles={handleFileSelect}
                            accept={{ "application/pdf": [".pdf"] }}
                            label="Click or drag PDF to sign"
                        />
                        {isRendering && <p className="text-center text-gray-400 mt-4 animate-pulse">Rendering PDF pages...</p>}
                    </div>
                )}

                {file && (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left: Controls & Signature Creation */}
                        <div className="lg:col-span-1 flex flex-col gap-6">

                            {/* File Info */}
                            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex justify-between items-center shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <FileUp size={20} className="text-blue-500 flex-shrink-0" />
                                    <span className="text-sm text-gray-900 dark:text-gray-200 truncate">{file.name}</span>
                                </div>
                                <button onClick={() => { setFile(null); setPages([]); }} className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"><X size={18} /></button>
                            </div>

                            {/* Signature Creator */}
                            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-4">Create Signature</h3>

                                <div className="flex gap-2 mb-4">
                                    <button
                                        onClick={() => setSigType("draw")}
                                        className={cn("flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors", sigType === "draw" ? "bg-blue-50 dark:bg-gray-800 border-blue-500 text-blue-600 dark:text-white" : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800")}
                                    >
                                        <PenTool size={14} className="inline mr-1" /> Draw
                                    </button>
                                    <button
                                        onClick={() => setSigType("type")}
                                        className={cn("flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors", sigType === "type" ? "bg-blue-50 dark:bg-gray-800 border-blue-500 text-blue-600 dark:text-white" : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800")}
                                    >
                                        <Type size={14} className="inline mr-1" /> Type
                                    </button>
                                    <button
                                        onClick={() => setSigType("upload")}
                                        className={cn("flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors", sigType === "upload" ? "bg-blue-50 dark:bg-gray-800 border-blue-500 text-blue-600 dark:text-white" : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800")}
                                    >
                                        <ImageIcon size={14} className="inline mr-1" /> Upload
                                    </button>
                                </div>

                                {/* Draw Area */}
                                {sigType === "draw" && (
                                    <div className="space-y-3">
                                        <div className="bg-white rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 h-40 relative touch-none shadow-inner">
                                            <canvas
                                                ref={canvasRef}
                                                width={300}
                                                height={160}
                                                className="w-full h-full cursor-crosshair"
                                                onMouseDown={startDrawing}
                                                onMouseMove={draw}
                                                onMouseUp={() => { stopDrawing(); saveDrawing(); }}
                                                onMouseLeave={stopDrawing}
                                                onTouchStart={startDrawing}
                                                onTouchMove={draw}
                                                onTouchEnd={() => { stopDrawing(); saveDrawing(); }}
                                            />
                                            <button
                                                onClick={clearCanvas}
                                                className="absolute top-2 right-2 p-1.5 bg-gray-100/80 hover:bg-gray-200 text-gray-600 rounded-lg backdrop-blur-sm shadow-sm"
                                                title="Clear"
                                            >
                                                <Eraser size={16} />
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 text-center">Draw your signature above</p>
                                    </div>
                                )}

                                {/* Type Area */}
                                {sigType === "type" && (
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            value={typedName}
                                            onChange={e => setTypedName(e.target.value)}
                                            placeholder="Type your name..."
                                            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-200 outline-none focus:border-blue-500 transition-colors placeholder:text-gray-400"
                                        />
                                        <div className="flex gap-2">
                                            {['cursive', 'serif', 'sans-serif'].map(f => (
                                                <button
                                                    key={f}
                                                    onClick={() => setTypedFont(f)}
                                                    className={cn(
                                                        "flex-1 py-2 text-xs border rounded-lg transition-colors",
                                                        typedFont === f ? "bg-blue-50 dark:bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400" : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                                                    )}
                                                    style={{ fontFamily: f === 'cursive' ? 'Brush Script MT, cursive' : f }}
                                                >
                                                    Abc
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Upload Area */}
                                {sigType === "upload" && (
                                    <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <input type="file" accept="image/*" onChange={handleSigUpload} className="hidden" id="sig-upload" />
                                        <label htmlFor="sig-upload" className="cursor-pointer block">
                                            <ImageIcon size={24} className="mx-auto text-gray-400 dark:text-gray-500 mb-2" />
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Click to upload image</span>
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Scale Control */}
                            {signature && (
                                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2 block">Signature Size</label>
                                    <input
                                        type="range"
                                        min="0.5"
                                        max="3"
                                        step="0.1"
                                        value={sigScale}
                                        onChange={e => setSigScale(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                </div>
                            )}

                            {/* Finish Action */}
                            <button
                                onClick={processPdf}
                                disabled={!signature}
                                className={cn(
                                    "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg",
                                    !signature
                                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-500 text-white shadow-green-500/20 hover:scale-[1.02]"
                                )}
                            >
                                <Download size={20} /> Sign PDF
                            </button>

                        </div>

                        {/* Right: PDF Preview & placement */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                                {/* Toolbar */}
                                <div className="p-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Page {currentPage + 1} of {pages.length}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                                            disabled={currentPage === 0}
                                            className="p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(pages.length - 1, p + 1))}
                                            disabled={currentPage === pages.length - 1}
                                            className="p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Page View */}
                                <div className="relative bg-gray-100 dark:bg-gray-800/50 p-4 md:p-8 flex justify-center overflow-auto min-h-[500px]">
                                    {pages[currentPage] ? (
                                        <div
                                            ref={containerRef}
                                            className="relative shadow-xl ring-1 ring-black/10 select-none bg-white cursor-crosshair"
                                            style={{ maxHeight: '70vh', width: 'fit-content' }}
                                            onClick={handleCanvasClick}
                                        >
                                            <img
                                                src={pages[currentPage]}
                                                alt={`Page ${currentPage + 1}`}
                                                className="block max-w-full h-auto pointer-events-none"
                                            />

                                            {/* Draggable Signature Grid/Overlay */}
                                            {signature && (
                                                <div
                                                    className="absolute cursor-move group z-20"
                                                    style={{
                                                        left: `${position.x}%`,
                                                        top: `${position.y}%`,
                                                        transform: 'translate(-50%, -50%)', // Center on point
                                                    }}
                                                    onMouseDown={handleDragStart}
                                                    onTouchStart={handleDragStart}
                                                    onClick={(e) => { e.stopPropagation(); setIsSelected(true); }} // Select on click, stop prop so canvas doesn't deselect
                                                >
                                                    <div className={cn(
                                                        "relative border-2 rounded p-1 transition-all",
                                                        isSelected
                                                            ? "border-blue-500 bg-blue-500/10 shadow-lg"
                                                            : (dragging
                                                                ? "border-blue-500 bg-blue-500/10 shadow-lg scale-105"
                                                                : "border-transparent group-hover:border-blue-400/50 border-dashed")
                                                    )}>
                                                        <img
                                                            src={signature}
                                                            alt="Signature"
                                                            className="pointer-events-none select-none block max-w-none w-auto"
                                                            style={{
                                                                height: `${40 * sigScale}px`,
                                                                minWidth: '50px'
                                                            }}
                                                        />
                                                        {/* Handle */}
                                                        {isSelected && (
                                                            <div className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 shadow-sm cursor-pointer hover:bg-red-600"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSignature(null);
                                                                    setIsSelected(false);
                                                                }}
                                                            >
                                                                <X size={10} />
                                                            </div>
                                                        )}
                                                        {!isSelected && (
                                                            <div className={cn(
                                                                "absolute -top-3 -right-3 bg-blue-500 text-white rounded-full p-1 shadow-sm transition-opacity",
                                                                dragging ? "opacity-100 invert" : "opacity-0 group-hover:opacity-100"
                                                            )}>
                                                                <Move size={10} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center text-gray-500 h-64">
                                            Loading page...
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className="text-center text-xs text-gray-500 mt-4">
                                Drag to position. Click to select. Backspace/Delete to remove.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

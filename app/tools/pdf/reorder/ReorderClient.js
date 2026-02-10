"use client";

import { useState, useCallback } from "react";
import { ArrowUpDown, Download, FileText, X, Loader2, GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolDropzone from "@/components/tool/ToolDropzone";
import ToolActions, { ActionButton } from "@/components/tool/ToolActions";
import ToolResult from "@/components/tool/ToolResult";
import { reorderPdf, getPdfPageCount } from "@/lib/pdf/reorder";
import { renderPdfPages } from "@/lib/pdf/render";
import { downloadBlob } from "@/lib/utils/download";

// Sortable Item Component
function SortableItem({ id, page, onRemove, onMove }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 999 : "auto",
        position: "relative",
        touchAction: "none",
    };

    return (
        <div ref={setNodeRef} style={style} className="group h-full">
            <div className="bg-[#1a1e27] border border-gray-800 rounded-xl p-3 relative flex flex-col items-center gap-2 h-full">
                {/* Drag Handle Area */}
                <div
                    {...attributes}
                    {...listeners}
                    className="relative w-full aspect-[3/4] bg-[#0f1115] rounded overflow-hidden flex items-center justify-center border border-gray-800 cursor-grab"
                >
                    {page.thumbnail ? (
                        <img src={page.thumbnail} alt={`Page ${page.originalIndex + 1}`} className="w-full h-full object-contain pointer-events-none" />
                    ) : (
                        <span className="text-gray-600 text-xs">Preview unavailable</span>
                    )}

                    <div className="absolute top-1.5 left-1.5 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {page.originalIndex + 1}
                    </div>

                    <div className="absolute bottom-1.5 right-1.5 text-white/70 bg-black/40 rounded p-0.5">
                        <GripVertical size={14} />
                    </div>
                </div>

                {/* Fallback Move Buttons (Hidden on touch devices usually, but good to keep for accessibility) */}
                <div className="flex gap-1 w-full justify-center">
                    <button
                        onClick={(e) => { e.stopPropagation(); onMove(id, "up"); }}
                        className="p-1.5 bg-[#2a2f3a] border-none rounded-md cursor-pointer text-gray-200 hover:bg-[#3a4050] transition-colors"
                        title="Move Left/Up"
                    >
                        <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onMove(id, "down"); }}
                        className="p-1.5 bg-[#2a2f3a] border-none rounded-md cursor-pointer text-gray-200 hover:bg-[#3a4050] transition-colors"
                        title="Move Right/Down"
                    >
                        <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove(page.id);
                    }}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 border-2 border-[#1a1e27] rounded-full cursor-pointer text-white flex items-center justify-center z-10 w-6 h-6 hover:bg-red-600 transition-colors"
                    title="Remove Page"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}

export default function ReorderPdfClient() {
    const [file, setFile] = useState(null);
    const [pageOrder, setPageOrder] = useState([]); // Array of { originalIndex, id, thumbnail }
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [resultBlob, setResultBlob] = useState(null);
    const [error, setError] = useState(null);
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleFiles = useCallback(async (files) => {
        const f = files[0];
        setFile(f);
        setResultBlob(null);
        setError(null);
        setLoading(true);
        try {
            const count = await getPdfPageCount(f);

            let thumbnails = [];
            try {
                thumbnails = await renderPdfPages(f, { width: 200 });
            } catch (err) {
                console.warn("Failed to render thumbnails", err);
                thumbnails = new Array(count).fill(null);
            }

            const initialOrder = Array.from({ length: count }, (_, i) => ({
                originalIndex: i,
                id: i + 1,
                thumbnail: thumbnails[i] || null
            }));
            setPageOrder(initialOrder);
        } catch (e) {
            setError("Failed to load PDF: " + e.message);
            setFile(null);
        }
        setLoading(false);
    }, []);

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setPageOrder((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
        setActiveId(null);
    };

    const removePage = (id) => {
        setPageOrder((prev) => prev.filter((p) => p.id !== id));
    };

    // Manual move fallback
    const movePageManual = (id, direction) => {
        const index = pageOrder.findIndex(p => p.id === id);
        if (index === -1) return;

        if (direction === "up" && index > 0) {
            setPageOrder(items => arrayMove(items, index, index - 1));
        } else if (direction === "down" && index < pageOrder.length - 1) {
            setPageOrder(items => arrayMove(items, index, index + 1));
        }
    };

    const handleReorder = async () => {
        if (pageOrder.length === 0) {
            setError("No pages left to reorder.");
            return;
        }
        setProcessing(true);
        setError(null);
        try {
            const indices = pageOrder.map((p) => p.originalIndex);
            const blob = await reorderPdf(file, indices);
            setResultBlob(blob);
        } catch (e) {
            setError(e.message);
        }
        setProcessing(false);
    };

    return (
        <div className="max-w-[1280px] mx-auto px-6 py-10">
            <ToolHeader
                title="Reorder PDF"
                description="Rearrange, drag & drop, and remove pages in your PDF document visually."
                breadcrumbs={[{ label: "PDF Tools", href: "/category/pdf" }, { label: "Reorder PDF" }]}
            />
            <div className="max-w-3xl mx-auto">
                {!file ? (
                    <ToolDropzone
                        onFiles={handleFiles}
                        accept=".pdf"
                        multiple={false}
                        label="Upload a PDF to reorder"
                        sublabel="or click to browse"
                        supportedText="Supported: .PDF (Max 50MB)"
                        loading={loading}
                    />
                ) : (
                    <div>
                        <div className="bg-[#171a21] border border-gray-800 rounded-2xl p-5 mb-6">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-blue-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-200 m-0">{file.name}</p>
                                    <p className="text-xs text-gray-500 m-0">{(file.size / 1024 / 1024).toFixed(2)} MB • {pageOrder.length} Pages</p>
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-10 text-gray-400">
                                <Loader2 className="w-6 h-6 animate-spin mb-3 mx-auto" />
                                <p>Generating page previews...</p>
                            </div>
                        ) : (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext items={pageOrder.map(p => p.id)} strategy={rectSortingStrategy}>
                                    <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4 mb-6">
                                        {pageOrder.map((page) => (
                                            <SortableItem key={page.id} id={page.id} page={page} onRemove={removePage} onMove={movePageManual} />
                                        ))}
                                    </div>
                                </SortableContext>

                                <DragOverlay>
                                    {activeId ? (
                                        <div className="scale-105 cursor-grabbing">
                                            <div className="bg-[#1a1e27] border border-blue-500 rounded-xl p-3 relative flex flex-col items-center gap-2 shadow-2xl">
                                                <div className="relative w-full aspect-[3/4] bg-[#0f1115] rounded overflow-hidden flex items-center justify-center border border-gray-800">
                                                    {(() => {
                                                        const p = pageOrder.find(x => x.id === activeId);
                                                        return p?.thumbnail ? (
                                                            <img src={p.thumbnail} alt="" className="w-full h-full object-contain" />
                                                        ) : null;
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
                                </DragOverlay>
                            </DndContext>
                        )}

                        <ToolActions>
                            <ActionButton onClick={handleReorder} loading={processing} icon={ArrowUpDown}>
                                Reorder & Download
                            </ActionButton>
                            <ActionButton variant="secondary" onClick={() => { setFile(null); setPageOrder([]); setResultBlob(null); }}>
                                Change File
                            </ActionButton>
                        </ToolActions>

                        {error && <ToolResult success={false} message={error} />}

                        {resultBlob && (
                            <div className="mt-6">
                                <ToolResult success message="PDF Reordered Successfully" />
                                <div className="mt-4 text-center">
                                    <button
                                        onClick={() => downloadBlob(resultBlob, `kitbase-reordered-${file.name}`)}
                                        className="inline-flex items-center gap-2 px-7 py-3.5 bg-emerald-500 text-gray-950 font-semibold text-[15px] rounded-xl border-none cursor-pointer hover:bg-emerald-400 transition-colors"
                                    >
                                        <Download className="w-[18px] h-[18px]" /> Download Reordered PDF
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

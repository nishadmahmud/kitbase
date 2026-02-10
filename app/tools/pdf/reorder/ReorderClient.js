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
        <div ref={setNodeRef} style={style} className="group">
            <div style={{
                backgroundColor: "#1a1e27", border: "1px solid #2a2f3a", borderRadius: "12px", padding: "12px",
                position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
                height: "100%"
            }}>
                {/* Drag Handle Area */}
                <div
                    {...attributes}
                    {...listeners}
                    style={{
                        position: "relative", width: "100%", aspectRatio: "3/4",
                        backgroundColor: "#0f1115", borderRadius: "4px", overflow: "hidden",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        border: "1px solid #2a2f3a", cursor: "grab"
                    }}
                >
                    {page.thumbnail ? (
                        <img src={page.thumbnail} alt={`Page ${page.originalIndex + 1}`} style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }} />
                    ) : (
                        <span style={{ color: "#4b5563", fontSize: "12px" }}>Preview unavailable</span>
                    )}

                    <div style={{
                        position: "absolute", top: "6px", left: "6px",
                        width: "24px", height: "24px", backgroundColor: "rgba(0,0,0,0.6)",
                        borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                        color: "white", fontSize: "12px", fontWeight: 600
                    }}>
                        {page.originalIndex + 1}
                    </div>

                    <div style={{
                        position: "absolute", bottom: "6px", right: "6px",
                        color: "rgba(255,255,255,0.7)", backgroundColor: "rgba(0,0,0,0.4)",
                        borderRadius: "4px", padding: "2px"
                    }}>
                        <GripVertical size={14} />
                    </div>
                </div>

                {/* Fallback Move Buttons (Hidden on touch devices usually, but good to keep for accessibility) */}
                <div style={{ display: "flex", gap: "4px", width: "100%", justifyContent: "center" }}>
                    <button
                        onClick={(e) => { e.stopPropagation(); onMove(id, "up"); }}
                        style={{ padding: "6px", background: "#2a2f3a", border: "none", borderRadius: "6px", cursor: "pointer", color: "#e6e8ee" }}
                        title="Move Left/Up"
                    >
                        <ArrowUp style={{ width: "14px", height: "14px" }} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onMove(id, "down"); }}
                        style={{ padding: "6px", background: "#2a2f3a", border: "none", borderRadius: "6px", cursor: "pointer", color: "#e6e8ee" }}
                        title="Move Right/Down"
                    >
                        <ArrowDown style={{ width: "14px", height: "14px" }} />
                    </button>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove(page.id);
                    }}
                    style={{
                        position: "absolute", top: "-8px", right: "-8px",
                        padding: "4px", backgroundColor: "#ef4444", border: "2px solid #1a1e27",
                        borderRadius: "50%", cursor: "pointer", color: "white",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        zIndex: 10, width: "24px", height: "24px"
                    }}
                    title="Remove Page"
                >
                    <X style={{ width: "14px", height: "14px" }} />
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
                thumbnails = await renderPdfPages(f);
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
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
            <ToolHeader
                title="Reorder PDF"
                description="Rearrange, drag & drop, and remove pages in your PDF document visually."
                breadcrumbs={[{ label: "PDF Tools", href: "/category/pdf" }, { label: "Reorder PDF" }]}
            />
            <div style={{ maxWidth: "720px", margin: "0 auto" }}>
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
                        <div style={{ backgroundColor: "#171a21", border: "1px solid #2a2f3a", borderRadius: "16px", padding: "20px", marginBottom: "24px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <FileText style={{ width: "20px", height: "20px", color: "#4f8cff" }} />
                                <div>
                                    <p style={{ fontSize: "14px", fontWeight: 500, color: "#e6e8ee", margin: 0 }}>{file.name}</p>
                                    <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>{(file.size / 1024 / 1024).toFixed(2)} MB • {pageOrder.length} Pages</p>
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: "center", padding: "40px", color: "#9aa0aa" }}>
                                <Loader2 style={{ width: "24px", height: "24px", animation: "spin 1s linear infinite", marginBottom: "12px" }} />
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
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                                        {pageOrder.map((page) => (
                                            <SortableItem key={page.id} id={page.id} page={page} onRemove={removePage} onMove={movePageManual} />
                                        ))}
                                    </div>
                                </SortableContext>

                                <DragOverlay>
                                    {activeId ? (
                                        <div style={{ transform: "scale(1.05)", cursor: "grabbing" }}>
                                            <div style={{
                                                backgroundColor: "#1a1e27", border: "1px solid #4f8cff", borderRadius: "12px", padding: "12px",
                                                position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
                                                boxShadow: "0 10px 20px rgba(0,0,0,0.5)"
                                            }}>
                                                <div style={{
                                                    position: "relative", width: "100%", aspectRatio: "3/4",
                                                    backgroundColor: "#0f1115", borderRadius: "4px", overflow: "hidden",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    border: "1px solid #2a2f3a"
                                                }}>
                                                    {(() => {
                                                        const p = pageOrder.find(x => x.id === activeId);
                                                        return p?.thumbnail ? (
                                                            <img src={p.thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
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
                            <div style={{ marginTop: "24px" }}>
                                <ToolResult success message="PDF Reordered Successfully" />
                                <div style={{ marginTop: "16px", textAlign: "center" }}>
                                    <button
                                        onClick={() => downloadBlob(resultBlob, `kitbase-reordered-${file.name}`)}
                                        style={{
                                            display: "inline-flex", alignItems: "center", gap: "8px",
                                            padding: "14px 28px", backgroundColor: "#34d399", color: "#0f1115",
                                            fontWeight: 600, fontSize: "15px", borderRadius: "12px",
                                            border: "none", cursor: "pointer",
                                        }}
                                    >
                                        <Download style={{ width: "18px", height: "18px" }} /> Download Reordered PDF
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

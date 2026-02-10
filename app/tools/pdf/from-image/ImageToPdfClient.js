"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Download, Image as ImageIcon, X, ArrowUp, ArrowDown, FileDown, Plus } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolDropzone from "@/components/tool/ToolDropzone";
import ToolActions, { ActionButton } from "@/components/tool/ToolActions";
import ToolResult from "@/components/tool/ToolResult";
import { downloadBlob } from "@/lib/utils/download";

// Reusing SortableItem logic but adapted for Images
function SortableImage({ id, file, onRemove }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        position: "relative",
    };

    return (
        <div ref={setNodeRef} style={style} className="group">
            <div style={{
                position: "relative",
                aspectRatio: "3/4", // Portrait preview
                backgroundColor: "#1a1e27",
                border: "1px solid #2a2f3a",
                borderRadius: "12px",
                overflow: "hidden",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "grab",
                touchAction: "none" // Essential for dnd on touch
            }} {...attributes} {...listeners}>
                <img
                    src={file.preview}
                    alt="preview"
                    style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }}
                />

                <button
                    onClick={(e) => { e.stopPropagation(); onRemove(id); }}
                    style={{
                        position: "absolute", top: "8px", right: "8px",
                        width: "24px", height: "24px", borderRadius: "50%",
                        backgroundColor: "rgba(239, 68, 68, 0.9)", color: "white",
                        border: "none", display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer"
                    }}
                    onPointerDown={(e) => e.stopPropagation()} // Prevent drag start on click
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}

export default function ImageToPdfClient() {
    const [files, setFiles] = useState([]); // { id, file, preview }
    const [loading, setLoading] = useState(false);
    const [activeId, setActiveId] = useState(null);
    const [pdfBlob, setPdfBlob] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleFiles = (newFiles) => {
        const added = Array.from(newFiles).map(f => ({
            id: Math.random().toString(36).substr(2, 9),
            file: f,
            preview: URL.createObjectURL(f)
        }));
        setFiles(prev => [...prev, ...added]);
        setPdfBlob(null);
    };

    const handleDragStart = (event) => setActiveId(event.active.id);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setFiles((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
        setActiveId(null);
    };

    const removeFile = (id) => {
        setFiles(prev => prev.filter(f => f.id !== id));
        setPdfBlob(null);
    };

    const convertToPdf = async () => {
        if (files.length === 0) return;
        setLoading(true);
        try {
            const pdfDoc = await PDFDocument.create();

            for (const item of files) {
                const arrayBuffer = await item.file.arrayBuffer();
                let image;
                if (item.file.type === "image/jpeg" || item.file.name.toLowerCase().endsWith(".jpg") || item.file.name.toLowerCase().endsWith(".jpeg")) {
                    image = await pdfDoc.embedJpg(arrayBuffer);
                } else if (item.file.type === "image/png" || item.file.name.toLowerCase().endsWith(".png")) {
                    image = await pdfDoc.embedPng(arrayBuffer);
                } else {
                    // Fallback: try embedPng, if fails try embedJpg. Or skip.
                    // For now assume valid images.
                    continue;
                }

                const page = pdfDoc.addPage();
                const { width, height } = image.scale(1);

                // Fit image to page (A4 logic or fit-to-image)
                // Let's match page size to image size for best quality
                page.setSize(width, height);
                page.drawImage(image, {
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            setPdfBlob(blob);
        } catch (err) {
            console.error(err);
            alert("Failed to create PDF. Ensure all files are valid source images.");
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
            <ToolHeader
                title="Image to PDF"
                description="Convert JPG and PNG images into a single PDF document."
                breadcrumbs={[{ label: "PDF Tools", href: "/category/pdf" }, { label: "Image to PDF" }]}
            />

            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ marginBottom: "24px" }}>
                    <ToolDropzone
                        onFiles={handleFiles}
                        accept="image/jpeg, image/png"
                        multiple={true}
                        label="Drop images here"
                        supportedText="Supported: JPG, PNG"
                    />
                </div>

                {files.length > 0 && (
                    <div style={{ marginBottom: "24px" }}>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext items={files.map(f => f.id)} strategy={rectSortingStrategy}>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "16px" }}>
                                    {files.map(f => (
                                        <SortableImage key={f.id} id={f.id} file={f} onRemove={removeFile} />
                                    ))}
                                </div>
                            </SortableContext>

                            <DragOverlay>
                                {activeId ? (
                                    <div style={{
                                        width: "120px", aspectRatio: "3/4",
                                        border: "1px solid #4f8cff", borderRadius: "12px",
                                        overflow: "hidden", backgroundColor: "#1a1e27"
                                    }}>
                                        <img
                                            src={files.find(f => f.id === activeId)?.preview}
                                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                            alt=""
                                        />
                                    </div>
                                ) : null}
                            </DragOverlay>
                        </DndContext>
                    </div>
                )}

                <ToolActions>
                    <ActionButton
                        onClick={convertToPdf}
                        loading={loading}
                        icon={FileDown}
                        disabled={files.length === 0}
                    >
                        Convert to PDF
                    </ActionButton>
                    {files.length > 0 && (
                        <ActionButton variant="secondary" onClick={() => { setFiles([]); setPdfBlob(null); }}>
                            Clear All
                        </ActionButton>
                    )}
                </ToolActions>

                {pdfBlob && (
                    <div style={{ marginTop: "24px" }}>
                        <ToolResult success message="PDF Created Successfully!" />
                        <div style={{ marginTop: "16px", textAlign: "center" }}>
                            <button
                                onClick={() => downloadBlob(pdfBlob, "images-converted.pdf")}
                                style={{
                                    display: "inline-flex", alignItems: "center", gap: "8px",
                                    padding: "14px 28px", backgroundColor: "#34d399", color: "#0f1115",
                                    fontWeight: 600, fontSize: "15px", borderRadius: "12px", border: "none", cursor: "pointer"
                                }}
                            >
                                <Download size={18} /> Download PDF
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

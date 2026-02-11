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
    };

    return (
        <div ref={setNodeRef} style={style} className="group relative aspect-[3/4] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden flex items-center justify-center cursor-grab touch-none shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors" {...attributes} {...listeners}>
            <img
                src={file.preview}
                alt="preview"
                className="w-full h-full object-contain pointer-events-none"
            />

            <button
                onClick={(e) => { e.stopPropagation(); onRemove(id); }}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/90 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                onPointerDown={(e) => e.stopPropagation()} // Prevent drag start on click
            >
                <X size={14} />
            </button>
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
                    continue;
                }

                const page = pdfDoc.addPage();
                const { width, height } = image.scale(1);

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
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950 pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="Image to PDF"
                    description="Convert JPG and PNG images into a single PDF document."
                    breadcrumbs={[{ label: "PDF Tools", href: "/category/pdf" }, { label: "Image to PDF" }]}
                />
            </div>

            <div className="max-w-3xl mx-auto px-6">
                <div className="mb-6">
                    <ToolDropzone
                        onFiles={handleFiles}
                        accept="image/jpeg, image/png"
                        multiple={true}
                        label="Drop images here"
                        supportedText="Supported: JPG, PNG"
                    />
                </div>

                {files.length > 0 && (
                    <div className="mb-6">
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext items={files.map(f => f.id)} strategy={rectSortingStrategy}>
                                <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4">
                                    {files.map(f => (
                                        <SortableImage key={f.id} id={f.id} file={f} onRemove={removeFile} />
                                    ))}
                                </div>
                            </SortableContext>

                            <DragOverlay>
                                {activeId ? (
                                    <div className="w-[120px] aspect-[3/4] border border-gray-200 dark:border-gray-500 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-xl">
                                        <img
                                            src={files.find(f => f.id === activeId)?.preview}
                                            className="w-full h-full object-contain"
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
                    <div className="mt-6">
                        <ToolResult success message="PDF Created Successfully!" />
                        <div className="mt-4 text-center">
                            <button
                                onClick={() => downloadBlob(pdfBlob, "images-converted.pdf")}
                                className="inline-flex items-center gap-2 px-7 py-3.5 bg-emerald-500 text-white dark:text-gray-950 font-semibold text-[15px] rounded-xl hover:bg-emerald-600 dark:hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
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

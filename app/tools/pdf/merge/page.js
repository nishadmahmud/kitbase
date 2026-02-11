"use client";

import { useState, useCallback } from "react";
import { Merge, FileText, GripVertical, X, Download, Info } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolDropzone from "@/components/tool/ToolDropzone";
import ToolActions, { ActionButton } from "@/components/tool/ToolActions";
import ToolResult from "@/components/tool/ToolResult";
import { mergePdfs } from "@/lib/pdf/merge";
import { downloadBlob } from "@/lib/utils/download";
import { formatFileSize } from "@/lib/utils/file";

export default function MergePdfPage() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [mergedBlob, setMergedBlob] = useState(null);
    const [dragIdx, setDragIdx] = useState(null);

    const handleFiles = useCallback((newFiles) => {
        const pdfs = newFiles.filter((f) => f.type === "application/pdf" || f.name.endsWith(".pdf"));
        setFiles((prev) => [...prev, ...pdfs]);
        setResult(null);
        setError(null);
    }, []);

    const removeFile = (i) => {
        setFiles((prev) => prev.filter((_, idx) => idx !== i));
        setResult(null);
    };

    const handleDragStart = (i) => setDragIdx(i);
    const handleDragOver = (e, i) => {
        e.preventDefault();
        if (dragIdx === null || dragIdx === i) return;
        setFiles((prev) => {
            const next = [...prev];
            const [item] = next.splice(dragIdx, 1);
            next.splice(i, 0, item);
            return next;
        });
        setDragIdx(i);
    };
    const handleDragEnd = () => setDragIdx(null);

    const handleMerge = async () => {
        setLoading(true);
        setError(null);
        try {
            const blob = await mergePdfs(files);
            setMergedBlob(blob);
            setResult({
                title: "PDFs merged successfully!",
                description: `${files.length} files → ${formatFileSize(blob.size)}`,
            });
        } catch (e) {
            setError(e.message);
        }
        setLoading(false);
    };

    return (
        <div className="max-w-[1280px] mx-auto px-6 py-10">
            <ToolHeader
                title="Merge PDF"
                description="Combine multiple PDF files into a single document with ease and speed."
                breadcrumbs={[{ label: "PDF Tools", href: "/category/pdf" }, { label: "Merge PDF" }]}
            />

            <div className="flex flex-wrap gap-8">
                {/* Main */}
                <div className="flex-1 min-w-0">
                    <ToolDropzone
                        onFiles={handleFiles}
                        accept=".pdf"
                        multiple={true}
                        label="Drag & drop PDF files here"
                        sublabel="or click to browse from your computer"
                        supportedText="Supported: .PDF (Max 50MB each)"
                    />

                    {files.length > 0 && (
                        <div className="mt-6 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                            <div className="px-5 py-3.5 border-b border-gray-800 flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-400">
                                    {files.length} file{files.length !== 1 && "s"} added
                                </span>
                                <button
                                    onClick={() => { setFiles([]); setResult(null); }}
                                    className="text-[13px] text-red-500 bg-transparent border-none cursor-pointer hover:text-red-400 transition-colors"
                                >
                                    Clear all
                                </button>
                            </div>
                            <div>
                                {files.map((file, i) => (
                                    <div
                                        key={`${file.name}-${i}`}
                                        draggable
                                        onDragStart={() => handleDragStart(i)}
                                        onDragOver={(e) => handleDragOver(e, i)}
                                        onDragEnd={handleDragEnd}
                                        className={`flex items-center gap-3 px-5 py-3 cursor-grab transition-colors ${i < files.length - 1 ? "border-b border-gray-800" : ""
                                            } ${dragIdx === i ? "bg-gray-800 opacity-60" : "bg-transparent hover:bg-gray-800/30"}`}
                                    >
                                        <GripVertical className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                        <FileText className="w-4 h-4 text-gray-100 flex-shrink-0" />
                                        <span className="flex-1 text-sm text-gray-200 truncate">{file.name}</span>
                                        <span className="text-xs text-gray-500 flex-shrink-0">{formatFileSize(file.size)}</span>
                                        <button
                                            onClick={() => removeFile(i)}
                                            className="text-gray-500 hover:text-red-500 bg-transparent border-none cursor-pointer flex-shrink-0 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <ToolActions>
                        <ActionButton
                            onClick={handleMerge}
                            disabled={files.length < 2}
                            loading={loading}
                            icon={Merge}
                        >
                            Merge {files.length > 1 ? `${files.length} PDFs` : "PDFs"}
                        </ActionButton>
                    </ToolActions>

                    {error && (
                        <ToolResult success={false} message={error} />
                    )}

                    {result && (
                        <ToolResult
                            success
                            message={result.title}
                        />
                    )}

                    {result && mergedBlob && (
                        <div className="mt-4 text-center">
                            <button
                                onClick={() => downloadBlob(mergedBlob, "kitbase-merged.pdf")}
                                className="inline-flex items-center gap-2 px-7 py-3.5 bg-emerald-500 text-gray-950 font-semibold text-[15px] rounded-xl border-none cursor-pointer hover:bg-emerald-400 transition-colors"
                            >
                                <Download className="w-[18px] h-[18px]" /> Download Merged PDF
                            </button>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="w-[280px] flex-shrink-0 flex flex-col gap-5">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-200 m-0 mb-4">
                            <Info className="w-4 h-4 text-gray-100" />
                            How it works
                        </h3>
                        <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                            <li className="flex items-start gap-2 text-sm text-gray-400">
                                <span className="text-gray-100 font-bold">1.</span> Upload your PDF files
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-400">
                                <span className="text-gray-100 font-bold">2.</span> Drag to reorder if needed
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-400">
                                <span className="text-gray-100 font-bold">3.</span> Click Merge and download
                            </li>
                        </ul>
                    </div>
                    <div className="bg-[#171a21] border border-gray-800 rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-gray-200 m-0 mb-4">Specifications</h3>
                        <div className="flex flex-col gap-2.5">
                            <div className="flex justify-between text-[13px]">
                                <span className="text-gray-500">Max file size</span>
                                <span className="text-gray-400">50 MB each</span>
                            </div>
                            <div className="flex justify-between text-[13px]">
                                <span className="text-gray-500">Accepted format</span>
                                <span className="text-gray-400">.PDF</span>
                            </div>
                            <div className="flex justify-between text-[13px]">
                                <span className="text-gray-500">Processing</span>
                                <span className="text-emerald-400">Client-side</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState, useCallback } from "react";
import { Archive, Download, FileText } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolDropzone from "@/components/tool/ToolDropzone";
import ToolActions, { ActionButton } from "@/components/tool/ToolActions";
import ToolResult from "@/components/tool/ToolResult";
import { compressPdf } from "@/lib/pdf/compress";
import { downloadBlob } from "@/lib/utils/download";

export default function CompressPdfPage() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [resultBlob, setResultBlob] = useState(null);
    const [error, setError] = useState(null);

    const handleFiles = useCallback((files) => {
        setFile(files[0]);
        setResultBlob(null);
        setError(null);
    }, []);

    const handleCompress = async () => {
        setLoading(true);
        setError(null);
        try {
            const blob = await compressPdf(file);
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
                    title="Compress PDF"
                    description="Optimize and reduce the file size of your PDF documents."
                    breadcrumbs={[{ label: "PDF Tools", href: "/category/pdf" }, { label: "Compress PDF" }]}
                />
            </div>
            <div className="max-w-3xl mx-auto px-6">
                {!file ? (
                    <ToolDropzone
                        onFiles={handleFiles}
                        accept=".pdf"
                        multiple={false}
                        label="Upload a PDF to compress"
                        sublabel="or click to browse"
                        supportedText="Supported: .PDF (Max 50MB)"
                        loading={loading}
                    />
                ) : (
                    <div>
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 mb-6 shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-gray-500 dark:text-gray-100" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-200 m-0">{file.name}</p>
                                    <p className="text-xs text-gray-500 m-0">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                        </div>

                        <ToolActions>
                            <ActionButton onClick={handleCompress} loading={loading} icon={Archive}>
                                Optimize PDF
                            </ActionButton>
                            <ActionButton variant="secondary" onClick={() => { setFile(null); setResultBlob(null); }}>
                                Change File
                            </ActionButton>
                        </ToolActions>

                        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm text-amber-600 dark:text-amber-500">
                            <strong>Note:</strong> This tool performs structural optimization. If your PDF contains large images, the size reduction might be minimal as we prioritize document integrity.
                        </div>

                        {error && <ToolResult success={false} message={error} />}

                        {resultBlob && (
                            <div className="mt-6">
                                <ToolResult
                                    success
                                    message={`Optimized to ${(resultBlob.size / 1024 / 1024).toFixed(2)} MB`}
                                    description={
                                        resultBlob.size < file.size
                                            ? `Saved ${((file.size - resultBlob.size) / 1024 / 1024).toFixed(2)} MB (${((1 - resultBlob.size / file.size) * 100).toFixed(0)}%)`
                                            : "Already optimized."
                                    }
                                />
                                <div className="mt-4 text-center">
                                    <button
                                        onClick={() => downloadBlob(resultBlob, `kitbase-optimized-${file.name}`)}
                                        className="inline-flex items-center gap-2 px-7 py-3.5 bg-emerald-500 text-white dark:text-gray-950 font-semibold text-[15px] rounded-xl border-none cursor-pointer hover:bg-emerald-600 dark:hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
                                    >
                                        <Download className="w-[18px] h-[18px]" /> Download Optimized PDF
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

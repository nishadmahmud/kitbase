"use client";

import { useState, useCallback } from "react";
import { Scissors, Download, FileText } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolDropzone from "@/components/tool/ToolDropzone";
import ToolActions, { ActionButton } from "@/components/tool/ToolActions";
import ToolResult from "@/components/tool/ToolResult";
import { splitPdf } from "@/lib/pdf/split";
import { downloadBlob } from "@/lib/utils/download";

export default function SplitPdfPage() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [resultFiles, setResultFiles] = useState([]);
    const [error, setError] = useState(null);

    const handleFiles = useCallback((files) => {
        setFile(files[0]);
        setResultFiles([]);
        setError(null);
    }, []);

    const handleSplit = async () => {
        setLoading(true);
        setError(null);
        try {
            const files = await splitPdf(file);
            setResultFiles(files);
        } catch (e) {
            setError(e.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="Split PDF"
                    description="Separate one page or a whole set for easy conversion and organization."
                    breadcrumbs={[{ label: "PDF Tools", href: "/category/pdf" }, { label: "Split PDF" }]}
                />
            </div>
            <div className="max-w-3xl mx-auto px-6">
                {!file ? (
                    <ToolDropzone
                        onFiles={handleFiles}
                        accept=".pdf"
                        multiple={false}
                        label="Upload a PDF to split"
                        sublabel="or click to browse from your computer"
                        supportedText="Supported: .PDF (Max 50MB)"
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
                            <ActionButton onClick={handleSplit} loading={loading} icon={Scissors}>
                                Split All Pages
                            </ActionButton>
                            <ActionButton variant="secondary" onClick={() => { setFile(null); setResultFiles([]); }}>
                                Change File
                            </ActionButton>
                        </ToolActions>

                        {error && <ToolResult success={false} message={error} />}

                        {resultFiles.length > 0 && (
                            <div className="mt-6">
                                <ToolResult success message={`Split into ${resultFiles.length} pages`} />
                                <div className="mt-4 flex flex-col gap-2">
                                    {resultFiles.map((f, i) => (
                                        <div key={i} className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm dark:shadow-none transition-colors">
                                            <span className="text-sm text-gray-700 dark:text-gray-200">{f.name}</span>
                                            <button
                                                onClick={() => downloadBlob(f.blob, f.name)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-[13px] font-medium rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                                            >
                                                <Download className="w-3.5 h-3.5" /> Download
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

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
        <div className="max-w-[1280px] mx-auto px-6 py-10">
            <ToolHeader
                title="Split PDF"
                description="Separate one page or a whole set for easy conversion and organization."
                breadcrumbs={[{ label: "PDF Tools", href: "/category/pdf" }, { label: "Split PDF" }]}
            />
            <div className="max-w-3xl mx-auto">
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
                        <div className="bg-[#171a21] border border-gray-800 rounded-2xl p-5 mb-6">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-blue-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-200 m-0">{file.name}</p>
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
                                        <div key={i} className="flex items-center justify-between px-4 py-3 bg-[#171a21] border border-gray-800 rounded-xl">
                                            <span className="text-sm text-gray-200">{f.name}</span>
                                            <button
                                                onClick={() => downloadBlob(f.blob, f.name)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1e27] text-blue-500 text-[13px] font-medium rounded-lg border border-gray-800 cursor-pointer hover:bg-[#1e2230] hover:border-gray-700 transition-colors"
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

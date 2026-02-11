"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { Lock, FileUp, Download, X } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolDropzone from "@/components/tool/ToolDropzone";
import { cn } from "@/lib/utils/cn";

export default function ProtectPdfPage() {
    const [file, setFile] = useState(null);
    const [password, setPassword] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileSelect = (files) => {
        if (files?.[0]) {
            setFile(files[0]);
        }
    };

    const handleProtect = async () => {
        if (!file || !password) return;

        try {
            setIsProcessing(true);
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            // Simple encryption with user password
            pdfDoc.encrypt({
                userPassword: password,
                ownerPassword: password,
                permissions: {
                    printing: "highResolution",
                    modifying: false,
                    copying: false,
                    annotating: false,
                    fillingForms: false,
                    contentAccessibility: false,
                    documentAssembly: false,
                },
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            saveAs(blob, `protected-${file.name}`);
        } catch (err) {
            console.error(err);
            alert("Failed to protect PDF. The file might already be encrypted or corrupted.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 pb-12">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="Protect PDF"
                    description="Encrypt your PDF documents with a secure password."
                />
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10 flex flex-col gap-8">

                {/* Upload Section */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-lg">
                    {!file ? (
                        <ToolDropzone
                            onFilesSelected={handleFileSelect}
                            accept={{ "application/pdf": [".pdf"] }}
                            title="Click or drag PDF to encrypt"
                        />
                    ) : (
                        <div className="flex items-center gap-4 p-4 bg-gray-950 border border-gray-800 rounded-xl relative group">
                            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500 flex-shrink-0">
                                <FileUp size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-200 truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button
                                onClick={() => { setFile(null); setPassword(""); }}
                                className="text-gray-500 hover:text-red-400 p-2 rounded-lg hover:bg-gray-900 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Password Section */}
                {file && (
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="max-w-md mx-auto">
                            <h3 className="text-lg font-bold text-gray-200 mb-6 flex items-center gap-2 justify-center">
                                <Lock size={20} className="text-red-500" /> Set Password
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Enter Password
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Start typing..."
                                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-gray-200 outline-none focus:border-red-500/50 transition-colors placeholder:text-gray-700"
                                    />
                                </div>

                                <button
                                    onClick={handleProtect}
                                    disabled={!password || isProcessing}
                                    className={cn(
                                        "w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all",
                                        !password || isProcessing
                                            ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                                            : "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20 hover:scale-[1.02]"
                                    )}
                                >
                                    {isProcessing ? (
                                        <>Encrypting...</>
                                    ) : (
                                        <>
                                            <Download size={18} /> Encrypt & Download
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-xs text-gray-500 mt-4">
                                    The password will be required to open the PDF. Don't forget it!
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

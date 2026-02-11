"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { Unlock, FileUp, Download, X, AlertCircle } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolDropzone from "@/components/tool/ToolDropzone";
import { cn } from "@/lib/utils/cn";

export default function UnlockPdfPage() {
    const [file, setFile] = useState(null);
    const [password, setPassword] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");

    const handleFileSelect = (files) => {
        if (files?.[0]) {
            setFile(files[0]);
            setError("");
            setPassword("");
        }
    };

    const handleUnlock = async () => {
        if (!file) return;

        try {
            setIsProcessing(true);
            setError("");
            const arrayBuffer = await file.arrayBuffer();

            // Try to load. If it requires password, load() will throw or we pass password.
            // If we don't pass password and it's encrypted, it throws "Password required" usually.
            // But here we can just try to load with the password provided.

            let pdfDoc;
            try {
                // If password is providing, try with it.
                // If the file is NOT encrypted, this might still work or ignore it.
                // If the file IS encrypted but NO password provided, it throws.
                pdfDoc = await PDFDocument.load(arrayBuffer, { password: password || undefined });
            } catch (e) {
                // Check if error is about password
                if (e.message.includes("password")) {
                    throw new Error("Incorrect password or password required.");
                }
                throw e;
            }

            // If loaded successfully, we save it. `save()` exports without encryption by default
            // unless encrypt() is called. So just saving it removes the password.
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            saveAs(blob, `unlocked-${file.name}`);
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to unlock PDF.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 pb-12">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="Unlock PDF"
                    description="Remove passwords and restrictions from PDF files."
                />
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10 flex flex-col gap-8">

                {/* Upload Section */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-lg">
                    {!file ? (
                        <ToolDropzone
                            onFilesSelected={handleFileSelect}
                            accept={{ "application/pdf": [".pdf"] }}
                            title="Click or drag PDF to unlock"
                        />
                    ) : (
                        <div className="flex items-center gap-4 p-4 bg-gray-950 border border-gray-800 rounded-xl relative group">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500 flex-shrink-0">
                                <FileUp size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-200 truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button
                                onClick={() => { setFile(null); setPassword(""); setError(""); }}
                                className="text-gray-500 hover:text-blue-400 p-2 rounded-lg hover:bg-gray-900 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Password Input (Optional depending on file, but usually needed for unlock) */}
                {file && (
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="max-w-md mx-auto">
                            <h3 className="text-lg font-bold text-gray-200 mb-6 flex items-center gap-2 justify-center">
                                <Unlock size={20} className="text-blue-500" /> Unlock Settings
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Owner/User Password
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); setError(""); }}
                                        placeholder="Enter password if encrypted..."
                                        className={cn(
                                            "w-full bg-gray-950 border rounded-xl px-4 py-3 text-gray-200 outline-none transition-colors placeholder:text-gray-700",
                                            error ? "border-red-500 focus:border-red-500" : "border-gray-800 focus:border-blue-500/50"
                                        )}
                                    />
                                    {error && (
                                        <div className="flex items-center gap-2 mt-2 text-red-500 text-xs animate-in slide-in-from-top-1">
                                            <AlertCircle size={12} /> {error}
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleUnlock}
                                    disabled={isProcessing}
                                    className={cn(
                                        "w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all",
                                        isProcessing
                                            ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02]"
                                    )}
                                >
                                    {isProcessing ? (
                                        <>Unlocking...</>
                                    ) : (
                                        <>
                                            <Download size={18} /> Unlock & Download
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-xs text-gray-500 mt-4">
                                    This creates a new decrypted copy of your file. The original remains unchanged.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

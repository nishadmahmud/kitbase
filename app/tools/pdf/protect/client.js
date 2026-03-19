"use client";

import { useState } from "react";
import { saveAs } from "file-saver";
import { Lock, FileUp, Download, X, Eye, EyeOff } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolDropzone from "@/components/tool/ToolDropzone";
import { cn } from "@/lib/utils/cn";
import ToolResult from "@/components/tool/ToolResult";
import { encryptPdfQpdf } from "@/lib/pdf/qpdf";

export default function ProtectPdfClient() {
    const [file, setFile] = useState(null);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");
    const [done, setDone] = useState(false);

    const handleFileSelect = (files) => {
        if (files?.[0]) {
            setFile(files[0]);
        }
    };

    const handleProtect = async () => {
        if (!file || !password) return;

        try {
            setIsProcessing(true);
            setError("");
            setDone(false);

            const blob = await encryptPdfQpdf(file, password);
            saveAs(blob, `protected-${file.name}`);
            setDone(true);
        } catch (err) {
            setError(err?.message || "Failed to protect PDF.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950 pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="Protect PDF"
                    description="Encrypt your PDF documents with a secure password."
                />
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10 flex flex-col gap-8">

                {/* Upload Section */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                    {!file ? (
                        <ToolDropzone
                            onFiles={handleFileSelect}
                            accept={{ "application/pdf": [".pdf"] }}
                            label="Click or drag PDF to encrypt"
                        />
                    ) : (
                        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl relative group">
                            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500 flex-shrink-0">
                                <FileUp size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button
                                onClick={() => { setFile(null); setPassword(""); }}
                                className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Password Section */}
                {file && (
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm dark:shadow-2xl dark:shadow-black/20 animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors">
                        <div className="max-w-md mx-auto">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-200 mb-6 flex items-center gap-2 justify-center">
                                <Lock size={20} className="text-red-600 dark:text-red-500" /> Set Password
                            </h3>

                            <div className="space-y-4">
                                {error && <ToolResult success={false} message={error} />}
                                {done && <ToolResult success message="Protected PDF generated successfully." />}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Enter Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => { setPassword(e.target.value); setError(""); setDone(false); }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !isProcessing && password) handleProtect();
                                            }}
                                            placeholder="Start typing..."
                                            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl pl-4 pr-12 py-3 text-gray-900 dark:text-gray-200 outline-none focus:border-red-500/50 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-700"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                            disabled={isProcessing}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleProtect}
                                    disabled={!password || isProcessing}
                                    className={cn(
                                        "w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all",
                                        !password || isProcessing
                                            ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
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

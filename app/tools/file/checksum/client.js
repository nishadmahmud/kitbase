"use client";

import { useState } from "react";
import { Binary, Copy, Check, X, ShieldCheck } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolDropzone from "@/components/tool/ToolDropzone";
import { cn } from "@/lib/utils/cn";

export default function ChecksumVerifierClient() {
    const [file, setFile] = useState(null);
    const [algorithm, setAlgorithm] = useState("SHA-256");
    const [hash, setHash] = useState("");
    const [isCalculating, setIsCalculating] = useState(false);
    const [compareHash, setCompareHash] = useState("");

    // Web Crypto API supports: SHA-1, SHA-256, SHA-384, SHA-512
    const algorithms = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];

    const handleFileSelect = (files) => {
        if (files?.[0]) {
            setFile(files[0]);
            setHash("");
            setCompareHash("");
            // Auto calculate? Maybe better to let user click or auto-start.
            // Let's auto-start for better UX.
            calculateHash(files[0], algorithm);
        }
    };

    const calculateHash = async (fileToHash, algo) => {
        if (!fileToHash) return;

        setIsCalculating(true);
        setHash("");

        try {
            const arrayBuffer = await fileToHash.arrayBuffer();
            const hashBuffer = await crypto.subtle.digest(algo, arrayBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            setHash(hashHex);
        } catch (err) {
            console.error(err);
            alert("Failed to calculate hash. The file might be too large for browser processing.");
        } finally {
            setIsCalculating(false);
        }
    };

    const handleAlgorithmChange = (newAlgo) => {
        setAlgorithm(newAlgo);
        if (file) {
            calculateHash(file, newAlgo);
        }
    };

    const copyToClipboard = () => {
        if (hash) {
            navigator.clipboard.writeText(hash);
        }
    };

    const isMatch = compareHash && hash && compareHash.trim().toLowerCase() === hash.toLowerCase();
    const isMismatch = compareHash && hash && !isMatch;

    return (
        <div className="min-h-screen pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="Checksum Verifier"
                    description="Calculate and verify file hashes (SHA-1, SHA-256, SHA-512) directly in your browser."
                    breadcrumbs={[{ label: "Files", href: "/category/file" }, { label: "Checksum Verifier" }]}
                />
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10 flex flex-col gap-8">

                {/* Upload Section */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                    {!file ? (
                        <ToolDropzone
                            onFiles={handleFileSelect}
                            label="Click or drag file to calculate checksum"
                            multiple={false}
                        />
                    ) : (
                        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl relative group">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 flex-shrink-0">
                                <Binary size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button
                                onClick={() => { setFile(null); setHash(""); setCompareHash(""); }}
                                className="text-gray-500 hover:text-red-500 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    )}
                </div>

                {file && (
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Algorithm Selection */}
                        <div className="md:col-span-1 space-y-4">
                            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-4">Hash Algorithm</h3>
                                <div className="space-y-2">
                                    {algorithms.map(algo => (
                                        <button
                                            key={algo}
                                            onClick={() => handleAlgorithmChange(algo)}
                                            className={cn(
                                                "w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex justify-between items-center cursor-pointer",
                                                algorithm === algo
                                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                                    : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-750 hover:text-gray-900 dark:hover:text-gray-200"
                                            )}
                                        >
                                            {algo}
                                            {algorithm === algo && <ShieldCheck size={16} />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Results Area */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Calculated Hash */}
                            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                                    Calculated {algorithm} Hash
                                    {isCalculating && <span className="text-xs text-blue-500 dark:text-blue-400 animate-pulse ml-2">Calculating...</span>}
                                </h3>

                                <div className="relative group">
                                    <div className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 font-mono text-xs text-blue-600 dark:text-blue-400 break-all leading-relaxed">
                                        {hash || "..."}
                                    </div>
                                    {hash && (
                                        <button
                                            onClick={copyToClipboard}
                                            className="absolute top-2 right-2 p-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Copy to clipboard"
                                        >
                                            <Copy size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Comparison */}
                            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 transition-colors duration-300 shadow-sm dark:shadow-2xl dark:shadow-black/20"
                                style={{
                                    borderColor: isMatch ? 'rgba(34, 197, 94, 0.3)' : isMismatch ? 'rgba(239, 68, 68, 0.3)' : ''
                                }}
                            >
                                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Verify Hash (Paste to compare)</h3>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={compareHash}
                                        onChange={(e) => setCompareHash(e.target.value)}
                                        placeholder="Paste hash here..."
                                        className={cn(
                                            "w-full bg-gray-50 dark:bg-black/30 border rounded-lg pl-4 pr-10 py-3 font-mono text-xs outline-none transition-colors",
                                            isMatch ? "border-green-500 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/10" :
                                                isMismatch ? "border-red-500 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10" :
                                                    "border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-200 focus:border-blue-500"
                                        )}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {isMatch && <Check size={18} className="text-green-500" />}
                                        {isMismatch && <X size={18} className="text-red-500" />}
                                    </div>
                                </div>

                                {isMatch && (
                                    <p className="text-green-600 dark:text-green-500 text-xs mt-3 flex items-center gap-1">
                                        <Check size={12} strokeWidth={3} /> Match verified! The files are identical.
                                    </p>
                                )}
                                {isMismatch && (
                                    <p className="text-red-600 dark:text-red-500 text-xs mt-3 flex items-center gap-1">
                                        <X size={12} strokeWidth={3} /> Mismatch! The calculated hash does not match.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

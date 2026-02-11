"use client";

import { useState } from "react";
import { Copy, Check, RotateCcw, ArrowRightLeft } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";

export default function UrlEncoderPage() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState("encode"); // encode, decode
    const [copied, setCopied] = useState(false);

    const handleProcess = () => {
        try {
            if (mode === "encode") {
                setOutput(encodeURIComponent(input));
            } else {
                setOutput(decodeURIComponent(input));
            }
        } catch (e) {
            setOutput("Error: Invalid URL format");
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-950 pb-12">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="URL Encoder/Decoder"
                    description="Encode URLs to UTF-8 or decode them back to readable text."
                />
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10 flex flex-col gap-6">

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Input Area */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col h-[400px] shadow-lg">
                        <div className="px-5 py-3 border-b border-gray-800 bg-gray-950 flex justify-between items-center">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Input</span>
                            <button
                                onClick={() => { setInput(""); setOutput(""); }}
                                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-gray-400 hover:text-gray-200 bg-transparent hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <RotateCcw size={14} /> Clear
                            </button>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={mode === "encode" ? "Enter text to encode..." : "Enter URL to decode..."}
                            className="flex-1 w-full bg-transparent p-5 text-gray-200 text-base leading-relaxed outline-none resize-none placeholder:text-gray-700 font-mono"
                            spellCheck={false}
                        />
                    </div>

                    {/* Output Area */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col h-[400px] shadow-lg">
                        <div className="px-5 py-3 border-b border-gray-800 bg-gray-950 flex justify-between items-center">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Output</span>
                            <button
                                onClick={handleCopy}
                                disabled={!output}
                                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-colors border ${copied
                                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                                    : "bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    }`}
                            >
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                {copied ? "Copied" : "Copy"}
                            </button>
                        </div>
                        <textarea
                            value={output}
                            readOnly
                            placeholder="Result will appear here..."
                            className="flex-1 w-full bg-transparent p-5 text-gray-200 text-base leading-relaxed outline-none resize-none placeholder:text-gray-700 font-mono"
                        />
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col items-center gap-6 shadow-lg">
                    <div className="flex bg-gray-950 rounded-xl p-1 border border-gray-800">
                        <button
                            onClick={() => setMode("encode")}
                            className={`px-8 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === "encode"
                                ? "bg-gray-800 text-gray-100 shadow-sm"
                                : "text-gray-400 hover:text-gray-200"
                                }`}
                        >
                            Encode
                        </button>
                        <button
                            onClick={() => setMode("decode")}
                            className={`px-8 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === "decode"
                                ? "bg-gray-800 text-gray-100 shadow-sm"
                                : "text-gray-400 hover:text-gray-200"
                                }`}
                        >
                            Decode
                        </button>
                    </div>

                    <button
                        onClick={handleProcess}
                        className="flex items-center gap-2 px-8 py-3 rounded-xl text-base font-semibold bg-gray-100 text-gray-900 hover:bg-white hover:scale-105 transition-all shadow-lg shadow-gray-100/10"
                    >
                        <ArrowRightLeft size={18} /> {mode === "encode" ? "Encode URL" : "Decode URL"}
                    </button>
                </div>

            </div>
        </div>
    );
}

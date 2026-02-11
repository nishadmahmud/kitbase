"use client";

import { useState, useCallback } from "react";
import { Copy, ArrowRightLeft } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolActions, { ActionButton } from "@/components/tool/ToolActions";

export default function Base64Page() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState("encode");
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleProcess = useCallback(() => {
        setError(null);
        try {
            if (mode === "encode") {
                setOutput(btoa(unescape(encodeURIComponent(input))));
            } else {
                setOutput(decodeURIComponent(escape(atob(input))));
            }
        } catch (e) {
            setError("Invalid input for " + (mode === "encode" ? "encoding" : "decoding"));
            setOutput("");
        }
    }, [input, mode]);

    const handleCopy = useCallback(async () => {
        await navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [output]);

    return (
        <div className="max-w-[1280px] mx-auto px-6 py-10">
            <ToolHeader
                title="Base64 Encoder / Decoder"
                description="Encode and decode Base64 strings quickly in your browser."
                breadcrumbs={[{ label: "Text & Dev Tools", href: "/category/dev" }, { label: "Base64" }]}
            />

            <div className="max-w-3xl mx-auto flex flex-col gap-4">
                {/* Mode toggle */}
                <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1">
                    {["encode", "decode"].map((m) => (
                        <button
                            key={m}
                            onClick={() => { setMode(m); setOutput(""); setError(null); }}
                            className={`flex-1 p-2.5 text-sm font-medium rounded-lg border-none cursor-pointer transition-all duration-200 ${mode === m
                                ? "bg-gray-100 text-gray-900 shadow-md"
                                : "bg-transparent text-gray-400 hover:text-gray-200"
                                }`}
                        >
                            {m === "encode" ? "Encode" : "Decode"}
                        </button>
                    ))}
                </div>

                {/* Input */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                    <div className="px-5 py-3 border-b border-gray-800 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-950">
                        {mode === "encode" ? "Text Input" : "Base64 Input"}
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 to decode..."}
                        className="w-full h-40 p-5 bg-transparent text-gray-200 text-sm font-mono leading-relaxed border-none outline-none resize-none box-border"
                        spellCheck={false}
                    />
                </div>

                <ToolActions>
                    <ActionButton onClick={handleProcess} icon={ArrowRightLeft} disabled={!input.trim()}>
                        {mode === "encode" ? "Encode" : "Decode"}
                    </ActionButton>
                </ToolActions>

                {error && (
                    <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl text-sm text-red-400">
                        {error}
                    </div>
                )}

                {output && (
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-gray-950">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {mode === "encode" ? "Base64 Output" : "Text Output"}
                            </span>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1 text-xs text-gray-400 bg-transparent border-none cursor-pointer hover:text-gray-200 transition-colors"
                            >
                                <Copy className="w-3.5 h-3.5" />{copied ? "Copied!" : "Copy"}
                            </button>
                        </div>
                        <pre className="p-5 m-0 text-gray-200 text-sm font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap break-all">
                            {output}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}

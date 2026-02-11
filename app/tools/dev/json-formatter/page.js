"use client";

import { useState, useCallback } from "react";
import { Braces, Copy, Check, AlertTriangle } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolActions, { ActionButton } from "@/components/tool/ToolActions";
import { formatJson, minifyJson, validateJson } from "@/lib/dev/json";

const sampleJson = `{
  "name": "Kitbase",
  "version": "1.0.0",
  "features": ["PDF", "Image", "Markdown", "JSON"],
  "settings": {
    "theme": "dark",
    "privacy": true
  }
}`;

export default function JsonFormatterPage() {
    const [input, setInput] = useState(sampleJson);
    const [output, setOutput] = useState("");
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [validation, setValidation] = useState(null);

    const handleFormat = useCallback(() => {
        setError(null);
        setValidation(null);
        try {
            setOutput(formatJson(input));
        } catch (e) {
            setError(e.message);
        }
    }, [input]);

    const handleMinify = useCallback(() => {
        setError(null);
        setValidation(null);
        try {
            setOutput(minifyJson(input));
        } catch (e) {
            setError(e.message);
        }
    }, [input]);

    const handleValidate = useCallback(() => {
        setError(null);
        const result = validateJson(input);
        setValidation(result);
    }, [input]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(output || input);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-[1280px] mx-auto px-6 py-10">
            <ToolHeader
                title="JSON Formatter"
                description="Prettify and validate complex JSON data for better readability."
                breadcrumbs={[{ label: "Developer Tools", href: "/category/dev" }, { label: "JSON Formatter" }]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 min-h-[400px]">
                {/* Input */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
                    <div className="px-5 py-3 border-b border-gray-800 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-950">
                        Input
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        spellCheck={false}
                        className="flex-1 p-5 bg-transparent text-gray-200 text-sm font-mono leading-relaxed border-none outline-none resize-none"
                    />
                </div>

                {/* Output */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
                    <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between bg-gray-950">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Output</span>
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-1 text-xs text-gray-400 bg-transparent border-none cursor-pointer hover:text-gray-200 transition-colors"
                        >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                    <pre className="flex-1 p-5 m-0 text-gray-200 text-sm font-mono leading-relaxed overflow-y-auto whitespace-pre-wrap break-word">
                        {output || "Output will appear here..."}
                    </pre>
                </div>
            </div>

            {error && (
                <div className="mt-4 px-5 py-4 bg-red-500/5 border border-red-500/20 rounded-xl text-sm text-red-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
                </div>
            )}

            {validation && (
                <div className={`mt-4 px-5 py-4 rounded-xl text-sm border ${validation.valid
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                    : "bg-red-500/5 border-red-500/20 text-red-400"
                    }`}>
                    {validation.valid ? "✓ Valid JSON" : `✗ Invalid: ${validation.error}`}
                </div>
            )}

            <ToolActions>
                <ActionButton onClick={handleFormat} icon={Braces}>Format</ActionButton>
                <ActionButton onClick={handleMinify} variant="secondary">Minify</ActionButton>
                <ActionButton onClick={handleValidate} variant="secondary">Validate</ActionButton>
            </ToolActions>
        </div>
    );
}

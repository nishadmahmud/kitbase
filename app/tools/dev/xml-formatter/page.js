"use client";

import { useState } from "react";
import { Copy, Check, RotateCcw, FileCode } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";

export default function XmlFormatterPage() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    const formatXml = () => {
        try {
            setError("");
            let xml = input.trim();

            // Very basic XML formatting
            let formatted = '';
            let reg = /(>)(<)(\/*)/g;
            xml = xml.replace(reg, '$1\r\n$2$3');

            let pad = 0;
            xml.split('\r\n').forEach(function (node) {
                let indent = 0;
                if (node.match(/.+<\/\w[^>]*>$/)) {
                    indent = 0;
                } else if (node.match(/^<\/\w/)) {
                    if (pad !== 0) {
                        pad -= 1;
                    }
                } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
                    indent = 1;
                } else {
                    indent = 0;
                }

                let padding = '';
                for (let i = 0; i < pad; i++) {
                    padding += '  ';
                }

                formatted += padding + node + '\r\n';
                pad += indent;
            });

            if (formatted.length === 0) formatted = input; // fallback

            // Try DOMParser for validation
            const parser = new DOMParser();
            const doc = parser.parseFromString(input, "application/xml");
            if (doc.querySelector("parsererror")) {
                setError("Invalid XML");
            }

            setOutput(formatted);
        } catch (e) {
            setError("Error formatting XML");
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950 pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="XML Formatter"
                    description="Beautify and validate XML data with proper indentation."
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10 flex flex-col gap-6">

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-500 px-4 py-3 rounded-xl text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Input Area */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden flex flex-col h-[500px] shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                        <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 flex justify-between items-center">
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider">Input XML</span>
                            <button
                                onClick={() => { setInput(""); setOutput(""); }}
                                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <RotateCcw size={14} /> Clear
                            </button>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="<root><child>value</child></root>"
                            className="flex-1 w-full bg-transparent p-5 text-gray-900 dark:text-gray-200 text-xs leading-relaxed outline-none resize-none placeholder:text-gray-400 dark:placeholder:text-gray-700 font-mono"
                            spellCheck={false}
                        />
                    </div>

                    {/* Output Area */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden flex flex-col h-[500px] shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                        <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 flex justify-between items-center">
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider">Formatted XML</span>
                            <button
                                onClick={handleCopy}
                                disabled={!output}
                                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-colors border ${copied
                                    ? "bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20"
                                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            className="flex-1 w-full bg-transparent p-5 text-gray-900 dark:text-gray-200 text-xs leading-relaxed outline-none resize-none placeholder:text-gray-400 dark:placeholder:text-gray-700 font-mono"
                        />
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col items-center gap-6 shadow-sm dark:shadow-lg">
                    <button
                        onClick={formatXml}
                        className="flex items-center gap-2 px-8 py-3 rounded-xl text-base font-semibold bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-gray-900/10 dark:shadow-gray-100/10"
                    >
                        <FileCode size={18} /> Format XML
                    </button>
                </div>

            </div>
        </div>
    );
}

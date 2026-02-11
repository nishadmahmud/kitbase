"use client";

import { useState } from "react";
import { Copy, Check, RotateCcw, Eraser } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";

export default function TextCleanerPage() {
    const [text, setText] = useState("");
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const clean = (type) => {
        let newText = text;
        switch (type) {
            case "extra-spaces":
                newText = text.replace(/\s+/g, ' ').trim();
                break;
            case "empty-lines":
                newText = text.split('\n').filter(line => line.trim() !== '').join('\n');
                break;
            case "duplicate-lines":
                newText = [...new Set(text.split('\n'))].join('\n');
                break;
            case "trim-lines":
                newText = text.split('\n').map(line => line.trim()).join('\n');
                break;
        }
        setText(newText);
    };

    return (
        <div className="min-h-screen bg-gray-950 pb-12">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="Text Cleaner"
                    description="Remove extra spaces, duplicate lines, and empty lines from your text."
                />
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10 flex flex-col gap-6">

                {/* Control Bar */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-wrap gap-3 justify-center shadow-lg">
                    <ActionButton onClick={() => clean("extra-spaces")} label="Remove Extra Spaces" icon={Eraser} />
                    <ActionButton onClick={() => clean("empty-lines")} label="Remove Empty Lines" icon={Eraser} />
                    <div className="w-px bg-gray-800 mx-1 hidden md:block"></div>
                    <ActionButton onClick={() => clean("duplicate-lines")} label="Remove Duplicate Lines" icon={Eraser} />
                    <ActionButton onClick={() => clean("trim-lines")} label="Trim Every Line" icon={Eraser} />
                </div>

                {/* Editor Area */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col h-[500px] shadow-2xl shadow-black/20">
                    <div className="px-5 py-3 border-b border-gray-800 bg-gray-950 flex justify-between items-center">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Editor</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setText("")}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-gray-200 bg-transparent hover:bg-gray-800 rounded-lg transition-colors border border-transparent hover:border-gray-700"
                            >
                                <RotateCcw size={14} /> Reset
                            </button>
                            <button
                                onClick={handleCopy}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${copied
                                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                                    : "bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
                                    }`}
                            >
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                {copied ? "Copied" : "Copy Result"}
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Paste your text here to clean it..."
                        className="flex-1 w-full bg-transparent p-6 text-gray-200 text-base leading-relaxed outline-none resize-none placeholder:text-gray-700 font-mono"
                        spellCheck={false}
                    />
                </div>
            </div>
        </div>
    );
}

function ActionButton({ onClick, label, icon: Icon }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-gray-950 text-gray-300 border border-gray-800 hover:bg-gray-800 hover:text-white hover:border-gray-600 transition-all shadow-sm hover:shadow-md"
        >
            {Icon && <Icon size={16} className="text-gray-500" />} {label}
        </button>
    );
}

"use client";

import { useState, useMemo } from "react";
import { Copy, ArrowRight } from "lucide-react";
import { diffChars, diffWords, diffLines } from "diff";
import ToolHeader from "@/components/tool/ToolHeader";

const MODES = [
    { id: "chars", label: "Characters" },
    { id: "words", label: "Words" },
    { id: "lines", label: "Lines" },
];

export default function TextDiffPage() {
    const [oldText, setOldText] = useState("The quick brown fox jumps over the lazy dog.");
    const [newText, setNewText] = useState("The quick brown cat jumps over the lazy dog.");
    const [mode, setMode] = useState("words"); // chars, words, lines

    const differences = useMemo(() => {
        if (mode === "chars") return diffChars(oldText, newText);
        if (mode === "words") return diffWords(oldText, newText);
        if (mode === "lines") return diffLines(oldText, newText);
        return [];
    }, [oldText, newText, mode]);

    const copyResult = () => {
        navigator.clipboard.writeText(newText);
        alert("New text copied to clipboard!");
    };

    return (
        <div className="max-w-[1280px] mx-auto px-6 py-10">
            <ToolHeader
                title="Text Diff Viewer"
                description="Compare two blocks of text and highlight the differences."
                breadcrumbs={[{ label: "Dev Tools", href: "/category/dev" }, { label: "Text Diff" }]}
            />

            <div className="flex flex-col gap-6">
                {/* Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-[#171a21] px-6 py-4 rounded-2xl border border-gray-800 gap-4">
                    <div className="flex gap-2">
                        {MODES.map(m => (
                            <button
                                key={m.id}
                                onClick={() => setMode(m.id)}
                                className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-colors cursor-pointer ${mode === m.id
                                    ? "border-blue-500 bg-blue-500/10 text-blue-500"
                                    : "border-gray-800 bg-[#1a1e27] text-gray-200 hover:bg-gray-800"
                                    }`}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                    <div className="text-sm font-medium text-gray-400 flex items-center gap-4">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> <span className="text-red-500 font-bold">- Removed</span></span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> <span className="text-green-500 font-bold">+ Added</span></span>
                    </div>
                </div>

                {/* Input Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px]">
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Original Text</label>
                        <textarea
                            value={oldText}
                            onChange={(e) => setOldText(e.target.value)}
                            className="flex-1 p-4 rounded-xl border border-gray-800 bg-[#171a21] text-gray-200 outline-none resize-none font-mono text-sm leading-relaxed focus:border-blue-500 transition-colors"
                            placeholder="Paste original text here..."
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">New Text</label>
                        <textarea
                            value={newText}
                            onChange={(e) => setNewText(e.target.value)}
                            className="flex-1 p-4 rounded-xl border border-gray-800 bg-[#171a21] text-gray-200 outline-none resize-none font-mono text-sm leading-relaxed focus:border-blue-500 transition-colors"
                            placeholder="Paste new text here..."
                        />
                    </div>
                </div>

                {/* Diff Output */}
                <div className="bg-[#171a21] rounded-2xl border border-gray-800 overflow-hidden">
                    <div className="px-6 py-3 border-b border-gray-800 flex justify-between items-center bg-[#1a1e27]">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Difference Result</span>
                        <button
                            onClick={copyResult}
                            className="text-blue-500 flex items-center gap-1.5 text-sm font-medium hover:text-blue-400 transition-colors bg-transparent border-none cursor-pointer"
                        >
                            <Copy size={14} /> Copy New Text
                        </button>
                    </div>
                    <div className="p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap text-gray-200">
                        {differences.map((part, index) => {
                            const colorClass = part.added ? "text-green-500 bg-green-500/10" : part.removed ? "text-red-500 bg-red-500/10 line-through decoration-red-500/50" : "text-gray-200";
                            return (
                                <span key={index} className={`${colorClass} rounded px-0.5`}>
                                    {part.value}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

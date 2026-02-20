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

export default function TextDiffClient() {
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
        <div className="min-h-screen pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="Text Diff Viewer"
                    description="Compare two blocks of text and highlight the differences."
                    breadcrumbs={[{ label: "Dev Tools", href: "/category/dev" }, { label: "Text Diff" }]}
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10 flex flex-col gap-6">
                {/* Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-gray-900 px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-800 gap-4 shadow-sm dark:shadow-lg transition-colors">
                    <div className="flex gap-2">
                        {MODES.map(m => (
                            <button
                                key={m.id}
                                onClick={() => setMode(m.id)}
                                className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-colors cursor-pointer ${mode === m.id
                                    ? "border-gray-400 dark:border-gray-500 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                    : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    }`}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-4">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> <span className="text-red-500 font-bold">- Removed</span></span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> <span className="text-green-500 font-bold">+ Added</span></span>
                    </div>
                </div>

                {/* Input Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px]">
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Original Text</label>
                        <textarea
                            value={oldText}
                            onChange={(e) => setOldText(e.target.value)}
                            className="flex-1 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 outline-none resize-none font-mono text-sm leading-relaxed focus:border-gray-400 dark:focus:border-gray-500 transition-colors shadow-sm dark:shadow-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                            placeholder="Paste original text here..."
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">New Text</label>
                        <textarea
                            value={newText}
                            onChange={(e) => setNewText(e.target.value)}
                            className="flex-1 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 outline-none resize-none font-mono text-sm leading-relaxed focus:border-gray-400 dark:focus:border-gray-500 transition-colors shadow-sm dark:shadow-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                            placeholder="Paste new text here..."
                        />
                    </div>
                </div>

                {/* Diff Output */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                    <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-950 transition-colors">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Difference Result</span>
                        <button
                            onClick={copyResult}
                            className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5 text-sm font-medium hover:text-gray-900 dark:hover:text-gray-200 transition-colors bg-transparent border-none cursor-pointer"
                        >
                            <Copy size={14} /> Copy New Text
                        </button>
                    </div>
                    <div className="p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap text-gray-900 dark:text-gray-200">
                        {differences.map((part, index) => {
                            const colorClass = part.added ? "text-green-700 dark:text-green-500 bg-green-100 dark:bg-green-500/10" : part.removed ? "text-red-700 dark:text-red-500 bg-red-100 dark:bg-red-500/10 line-through decoration-red-500/50" : "text-gray-600 dark:text-gray-200";
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

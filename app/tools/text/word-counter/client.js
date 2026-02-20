"use client";

import { useState, useMemo } from "react";
import { Eraser, Copy, Check } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";

export default function WordCounterClient() {
    const [text, setText] = useState("");
    const [copied, setCopied] = useState(false);

    const stats = useMemo(() => {
        const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        const chars = text.length;
        const charsNoSpace = text.replace(/\s/g, "").length;
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length;
        const readingTime = Math.ceil(words / 200); // approx 200 wpm

        return { words, chars, charsNoSpace, sentences, paragraphs, readingTime };
    }, [text]);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        if (confirm("Are you sure you want to clear the text?")) {
            setText("");
        }
    };

    return (
        <div className="min-h-screen pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="Word Counter"
                    description="Count words, characters, sentences, and paragraphs in real-time."
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                    <StatCard label="Words" value={stats.words} />
                    <StatCard label="Characters" value={stats.chars} />
                    <StatCard label="Sentences" value={stats.sentences} />
                    <StatCard label="Paragraphs" value={stats.paragraphs} />
                    <StatCard label="No Spaces" value={stats.charsNoSpace} />
                    <StatCard label="Read Time" value={`~${stats.readingTime} min`} />
                </div>

                {/* Editor Area */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden flex flex-col h-[600px] shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                    <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950 flex justify-between items-center transition-colors">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Editor</span>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
                            >
                                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                {copied ? "Copied" : "Copy Text"}
                            </button>
                            <button
                                onClick={handleClear}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
                            >
                                <Eraser size={14} /> Clear
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type or paste your text here..."
                        className="flex-1 w-full bg-transparent p-6 text-gray-900 dark:text-gray-200 text-lg leading-relaxed outline-none resize-none placeholder:text-gray-400 dark:placeholder:text-gray-700 font-sans"
                        spellCheck={false}
                    />
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm transition-colors">
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{value}</span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
        </div>
    );
}

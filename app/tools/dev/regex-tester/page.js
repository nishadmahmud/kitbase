"use client";

import { useState, useMemo } from "react";
import { Copy, Check, Regex } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";

export default function RegexTesterPage() {
    const [pattern, setPattern] = useState("");
    const [flags, setFlags] = useState("gm");
    const [text, setText] = useState("");
    const [matches, setMatches] = useState([]);

    useMemo(() => {
        if (!pattern) {
            setMatches([]);
            return;
        }
        try {
            const regex = new RegExp(pattern, flags);
            const found = [];
            let match;
            // Prevent infinite loop with global flag if regex matches empty string
            if (!regex.global) {
                match = regex.exec(text);
                if (match) found.push({ index: match.index, text: match[0] });
            } else {
                let loopLimit = 0;
                while ((match = regex.exec(text)) !== null && loopLimit < 1000) {
                    found.push({ index: match.index, text: match[0] });
                    if (match.index === regex.lastIndex) regex.lastIndex++; // Avoid infinite loop on zero-width matches
                    loopLimit++;
                }
            }
            setMatches(found);
        } catch (e) {
            setMatches([]);
        }
    }, [pattern, flags, text]);

    // Simple highlighter - split text by matches
    const highlightedText = useMemo(() => {
        if (!pattern || matches.length === 0) return text;

        let lastIndex = 0;
        const parts = [];

        matches.forEach((m, i) => {
            if (m.index > lastIndex) {
                parts.push(<span key={`text-${i}`}>{text.slice(lastIndex, m.index)}</span>);
            }
            parts.push(
                <span key={`match-${i}`} className="bg-blue-500/30 text-blue-200 border-b border-blue-500/50 rounded-[2px]">
                    {m.text}
                </span>
            );
            lastIndex = m.index + m.text.length;
        });

        if (lastIndex < text.length) {
            parts.push(<span key="tail">{text.slice(lastIndex)}</span>);
        }
        return parts;
    }, [text, matches, pattern]);


    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950 pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="Regex Tester"
                    description="Test and debug JavaScript regular expressions with real-time highlighting."
                />
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10 flex flex-col gap-6">

                {/* Regex Input Bar */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex gap-4 items-center shadow-sm dark:shadow-lg transition-colors">
                    <span className="text-gray-400 dark:text-gray-500 font-mono text-xl font-bold">/</span>
                    <input
                        type="text"
                        value={pattern}
                        onChange={(e) => setPattern(e.target.value)}
                        placeholder="Expression (e.g. [a-z]+)"
                        className="flex-1 bg-transparent text-gray-900 dark:text-gray-200 text-lg font-mono outline-none placeholder:text-gray-400 dark:placeholder:text-gray-700"
                    />
                    <span className="text-gray-400 dark:text-gray-500 font-mono text-xl font-bold">/</span>
                    <input
                        type="text"
                        value={flags}
                        onChange={(e) => setFlags(e.target.value)}
                        placeholder="gimsuy"
                        className="w-20 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-2 py-1 text-gray-600 dark:text-gray-300 font-mono outline-none focus:border-gray-400 dark:focus:border-gray-600"
                    />
                </div>

                {/* Editor Area */}
                <div className="grid md:grid-cols-2 gap-6 h-[500px]">
                    {/* Input Text */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden flex flex-col shadow-sm dark:shadow-2xl dark:shadow-black/20 relative transition-colors">
                        <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 flex justify-between items-center">
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider">Test String</span>
                        </div>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Data to match against..."
                            className="flex-1 w-full bg-transparent p-5 text-gray-900 dark:text-gray-200 text-base leading-relaxed outline-none resize-none placeholder:text-gray-400 dark:placeholder:text-gray-700 font-mono z-10 relative bg-opacity-0"
                            spellCheck={false}
                        />
                    </div>

                    {/* Highlighted Preview */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden flex flex-col shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                        <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 flex justify-between items-center">
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider">Matches: {matches.length}</span>
                        </div>
                        <div className="flex-1 w-full bg-gray-50/50 dark:bg-gray-900/50 p-5 text-gray-500 dark:text-gray-400 text-base leading-relaxed font-mono overflow-auto whitespace-pre-wrap">
                            {highlightedText || <span className="text-gray-400 dark:text-gray-700 italic">Matches will highlight here...</span>}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

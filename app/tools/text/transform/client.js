"use client";

import { useState } from "react";
import { Copy, Check, RotateCcw, Shuffle, Repeat, ArrowRightLeft } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";

export default function StringTransformClient() {
    const [text, setText] = useState("");
    const [repeatCount, setRepeatCount] = useState(3);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const transform = (type) => {
        let newText = text;
        switch (type) {
            case "reverse":
                newText = text.split("").reverse().join("");
                break;
            case "shuffle":
                newText = text.split("").sort(() => Math.random() - 0.5).join("");
                break;
            case "repeat":
                newText = (text + " ").repeat(repeatCount).trim();
                break;
            case "reverse-words":
                newText = text.split(" ").reverse().join(" ");
                break;
        }
        setText(newText);
    };

    return (
        <div className="min-h-screen pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="String Transform"
                    description="Reverse text, shuffle characters, or repeat strings instantly."
                />
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10 flex flex-col gap-6">

                {/* Control Bar */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-wrap gap-4 justify-center shadow-sm dark:shadow-lg items-center transition-colors">
                    <ActionButton onClick={() => transform("reverse")} label="Reverse Text" icon={ArrowRightLeft} />
                    <ActionButton onClick={() => transform("reverse-words")} label="Reverse Words" icon={ArrowRightLeft} />
                    <ActionButton onClick={() => transform("shuffle")} label="Shuffle Characters" icon={Shuffle} />

                    <div className="w-px bg-gray-200 dark:bg-gray-800 h-10 mx-2 hidden md:block"></div>

                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-950 p-1.5 rounded-xl border border-gray-200 dark:border-gray-800 transition-colors">
                        <input
                            type="number"
                            min="1"
                            max="1000"
                            value={repeatCount}
                            onChange={(e) => setRepeatCount(Number(e.target.value))}
                            className="w-16 bg-transparent text-center text-gray-900 dark:text-gray-200 outline-none font-bold text-sm"
                        />
                        <ActionButton onClick={() => transform("repeat")} label="Repeat" icon={Repeat} compact />
                    </div>
                </div>

                {/* Editor Area */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden flex flex-col h-[500px] shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                    <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950 flex justify-between items-center transition-colors">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Editor</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setText("")}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                            >
                                <RotateCcw size={14} /> Reset
                            </button>
                            <button
                                onClick={handleCopy}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${copied
                                    ? "bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20"
                                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
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
                        placeholder="Type something to transform..."
                        className="flex-1 w-full bg-transparent p-6 text-gray-900 dark:text-gray-200 text-lg leading-relaxed outline-none resize-none placeholder:text-gray-400 dark:placeholder:text-gray-700 font-sans"
                        spellCheck={false}
                    />
                </div>
            </div>
        </div>
    );
}

function ActionButton({ onClick, label, icon: Icon, compact }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 rounded-xl text-sm font-semibold bg-gray-50 dark:bg-gray-950 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-all shadow-sm ${compact ? "px-4 py-2" : "px-6 py-3"
                }`}
        >
            {Icon && <Icon size={16} className="text-gray-400 dark:text-gray-500" />} {label}
        </button>
    );
}

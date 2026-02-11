"use client";

import { useState } from "react";
import { Copy, Check, RotateCcw, Type } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";

export default function CaseConverterPage() {
    const [text, setText] = useState("");
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const transform = (type) => {
        let newText = text;
        switch (type) {
            case "upper":
                newText = text.toUpperCase();
                break;
            case "lower":
                newText = text.toLowerCase();
                break;
            case "title":
                newText = text.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                break;
            case "sentence":
                newText = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
                break;
            case "camel":
                newText = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
                break;
            case "snake":
                newText = text && text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
                    .map(x => x.toLowerCase())
                    .join('_');
                break;
            case "kebab":
                newText = text && text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
                    .map(x => x.toLowerCase())
                    .join('-');
                break;
            case "alternating":
                newText = text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
                break;
            case "inverse":
                newText = text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
                break;
        }
        setText(newText);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950 pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="Case Converter"
                    description="Convert text to Uppercase, Lowercase, Title Case, CamelCase, and more."
                />
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10 flex flex-col gap-6">

                {/* Control Bar */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-2 flex flex-wrap gap-2 justify-center shadow-sm dark:shadow-lg transition-colors">
                    <ActionButton onClick={() => transform("upper")} label="UPPERCASE" />
                    <ActionButton onClick={() => transform("lower")} label="lowercase" />
                    <ActionButton onClick={() => transform("title")} label="Title Case" />
                    <ActionButton onClick={() => transform("sentence")} label="Sentence case" />
                    <div className="w-px bg-gray-200 dark:bg-gray-800 mx-1 hidden md:block"></div>
                    <ActionButton onClick={() => transform("camel")} label="camelCase" />
                    <ActionButton onClick={() => transform("snake")} label="snake_case" />
                    <ActionButton onClick={() => transform("kebab")} label="kebab-case" />
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
                        placeholder="Type or paste your text here..."
                        className="flex-1 w-full bg-transparent p-6 text-gray-900 dark:text-gray-200 text-lg leading-relaxed outline-none resize-none placeholder:text-gray-400 dark:placeholder:text-gray-700 font-sans"
                        spellCheck={false}
                    />
                </div>

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-2 flex flex-wrap gap-2 justify-center shadow-sm dark:shadow-lg transition-colors">
                    <ActionButton onClick={() => transform("alternating")} label="aLtErNaTiNg cAsE" />
                    <ActionButton onClick={() => transform("inverse")} label="InVeRsE CaSe" />
                    <button
                        onClick={() => {
                            const blob = new Blob([text], { type: "text/plain" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = "converted-text.txt";
                            a.click();
                        }}
                        className="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all flex-1 min-w-[120px] border border-gray-200 dark:border-gray-800"
                    >
                        Download .txt
                    </button>
                </div>
            </div>
        </div>
    );
}

function ActionButton({ onClick, label }) {
    return (
        <button
            onClick={onClick}
            className="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-50 dark:bg-gray-950 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-700 transition-all flex-1 min-w-[100px]"
        >
            {label}
        </button>
    );
}

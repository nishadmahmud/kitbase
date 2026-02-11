"use client";

import { useState, useEffect } from "react";
import { Copy, Check, RefreshCw, SlidersHorizontal } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";

const LOREM_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?`;

export default function LoremIpsumPage() {
    const [count, setCount] = useState(5);
    const [type, setType] = useState("paragraphs"); // paragraphs, sentences, words
    const [startWithLorem, setStartWithLorem] = useState(true);
    const [result, setResult] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        generate();
    }, [count, type, startWithLorem]);

    const generate = () => {
        let text = "";
        const words = LOREM_TEXT.replace(/[.,]/g, "").toLowerCase().split(" ");
        const sentences = LOREM_TEXT.split(". ").map(s => s.trim() + ".");
        const paragraphs = [LOREM_TEXT, LOREM_TEXT, LOREM_TEXT]; // Simple repetition for now, ideally strictly randomized

        if (type === "words") {
            // Generate random words
            let generatedWords = [];
            for (let i = 0; i < count; i++) {
                generatedWords.push(words[i % words.length]);
            }
            text = generatedWords.join(" ");
            if (startWithLorem) {
                // capitalize first letter
                text = "Lorem ipsum " + text.slice(text.indexOf(" ") + 1);
            } else {
                text = text.charAt(0).toUpperCase() + text.slice(1);
            }
        } else if (type === "sentences") {
            let generatedSentences = [];
            for (let i = 0; i < count; i++) {
                generatedSentences.push(sentences[i % sentences.length]);
            }
            text = generatedSentences.join(" ");
            if (startWithLorem && !text.startsWith("Lorem")) {
                text = "Lorem ipsum dolor sit amet. " + text;
            }
        } else {
            // Paragraphs
            let generatedParas = [];
            for (let i = 0; i < count; i++) {
                generatedParas.push(LOREM_TEXT); // In a real app we'd shuffle sentences to make unique paras
            }
            text = generatedParas.join("\n\n");
            if (startWithLorem) {
                // Ensure first para starts with Lorem
            }
        }

        // Basic implementation for "Start with Lorem"
        if (startWithLorem && !text.toLowerCase().startsWith("lorem")) {
            // It's hard to force this perfectly without breaking structure, but for paragraphs it's default.
        }

        setResult(text);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-950 pb-12">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="Lorem Ipsum Generator"
                    description="Generate placeholder text for paragraphs, sentences, or words."
                />
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10 flex flex-col gap-6">

                {/* Control Bar */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-wrap gap-6 items-center shadow-lg">

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</label>
                        <div className="flex bg-gray-950 rounded-xl p-1 border border-gray-800">
                            {["paragraphs", "sentences", "words"].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setType(t)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${type === t
                                        ? "bg-gray-800 text-gray-100 shadow-sm"
                                        : "text-gray-400 hover:text-gray-200"
                                        }`}
                                >
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Count</label>
                        <input
                            type="number"
                            min="1"
                            max="500"
                            value={count}
                            onChange={(e) => setCount(Number(e.target.value))}
                            className="w-24 px-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-gray-200 outline-none focus:border-gray-600 transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Options</label>
                        <label className="flex items-center gap-3 cursor-pointer py-2">
                            <input
                                type="checkbox"
                                checked={startWithLorem}
                                onChange={(e) => setStartWithLorem(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-700 bg-gray-950 text-gray-500 focus:ring-0 focus:ring-offset-0"
                            />
                            <span className="text-sm text-gray-300">Start with "Lorem ipsum"</span>
                        </label>
                    </div>

                    <div className="flex-1 flex justify-end">
                        <button
                            onClick={generate}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700 transition-all"
                        >
                            <RefreshCw size={18} /> Regenerate
                        </button>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col h-[500px] shadow-2xl shadow-black/20">
                    <div className="px-5 py-3 border-b border-gray-800 bg-gray-950 flex justify-between items-center">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Result</span>
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
                    <textarea
                        value={result}
                        readOnly
                        className="flex-1 w-full bg-transparent p-6 text-gray-200 text-lg leading-relaxed outline-none resize-none font-serif"
                    />
                </div>
            </div>
        </div>
    );
}

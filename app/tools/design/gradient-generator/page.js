"use client";

import { useState } from "react";
import { Copy, Check, ArrowRight, Dices } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";

export default function GradientGeneratorPage() {
    const [color1, setColor1] = useState("#3b82f6");
    const [color2, setColor2] = useState("#8b5cf6");
    const [direction, setDirection] = useState("to right");
    const [type, setType] = useState("linear-gradient"); // linear-gradient, radial-gradient

    const [copied, setCopied] = useState(false);

    const gradient = `${type}(${direction === "circle" ? "circle" : direction}, ${color1}, ${color2})`;
    const cssCode = `background: ${gradient};`;

    const handleCopy = () => {
        navigator.clipboard.writeText(cssCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const randomize = () => {
        const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        setColor1(randomColor());
        setColor2(randomColor());
    };

    return (
        <div className="min-h-screen pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="Gradient Generator"
                    description="Create beautiful CSS gradients and copy the code instantly."
                />
            </div>

            <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-10 flex flex-col md:flex-row gap-8">

                {/* Visualizer */}
                <div className="flex-1 min-h-[400px] rounded-3xl shadow-2xl border-4 border-white dark:border-gray-800 flex items-center justify-center relative overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors">
                    <div className="absolute inset-0" style={{ background: gradient }} />
                    <div className="relative z-10 bg-white/80 dark:bg-black/20 backdrop-blur-md text-gray-900 dark:text-white px-6 py-4 rounded-xl border border-white/20 dark:border-white/10 shadow-lg max-w-[80%] text-center">
                        <p className="font-mono text-sm opacity-90">{cssCode}</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="w-full md:w-[350px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors flex flex-col gap-6">

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">Colors</label>
                        <div className="flex gap-4">
                            <ColorPicker value={color1} onChange={setColor1} />
                            <ArrowRight className="text-gray-400 dark:text-gray-600 mt-3" />
                            <ColorPicker value={color2} onChange={setColor2} />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">Direction</label>
                        <div className="grid grid-cols-3 gap-2">
                            {["to right", "to left", "to bottom", "to top", "to bottom right", "to top left"].map(dir => (
                                <button
                                    key={dir}
                                    onClick={() => { setDirection(dir); setType("linear-gradient"); }}
                                    className={`p-2 text-xs rounded-lg border ${direction === dir && type === "linear-gradient"
                                        ? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-100"
                                        : "bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                                        }`}
                                >
                                    {dir.replace("to ", "🡢 ")}
                                </button>
                            ))}
                            <button
                                onClick={() => { setDirection("circle"); setType("radial-gradient"); }}
                                className={`p-2 text-xs rounded-lg border col-span-3 ${type === "radial-gradient"
                                    ? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-100"
                                    : "bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                                    }`}
                            >
                                Radial (Circle)
                            </button>
                        </div>
                    </div>

                    <div className="mt-auto flex flex-col gap-3">
                        <button
                            onClick={randomize}
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-gray-50 dark:bg-gray-950 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all"
                        >
                            <Dices size={18} /> Randomize
                        </button>
                        <button
                            onClick={handleCopy}
                            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-lg ${copied
                                ? "bg-green-500 text-white shadow-green-500/20"
                                : "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:scale-105 shadow-gray-900/10 dark:shadow-gray-100/10"
                                }`}
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                            {copied ? "Copied CSS" : "Copy CSS"}
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}

function ColorPicker({ value, onChange }) {
    return (
        <div className="flex-1">
            <div className="h-10 rounded-lg cursor-pointer border border-gray-200 dark:border-gray-700 relative overflow-hidden" style={{ backgroundColor: value }}>
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-transparent text-center font-mono text-sm mt-1 text-gray-500 dark:text-gray-400 outline-none"
            />
        </div>
    )
}

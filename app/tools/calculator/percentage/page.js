"use client";

import { useState, useMemo } from "react";
import { RotateCcw } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";

export default function PercentageCalculatorPage() {
    const [mode, setMode] = useState("whatIs");
    const [a, setA] = useState("");
    const [b, setB] = useState("");

    const result = useMemo(() => {
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        if (isNaN(numA) || isNaN(numB)) return null;

        switch (mode) {
            case "whatIs":
                return { value: ((numA / 100) * numB).toFixed(2), label: `${numA}% of ${numB} = ` };
            case "isWhatPercent":
                return numB !== 0
                    ? { value: ((numA / numB) * 100).toFixed(2) + "%", label: `${numA} is what % of ${numB} = ` }
                    : null;
            case "change":
                return numA !== 0
                    ? { value: (((numB - numA) / numA) * 100).toFixed(2) + "%", label: `Change from ${numA} to ${numB} = ` }
                    : null;
            default:
                return null;
        }
    }, [a, b, mode]);

    const modes = [
        { key: "whatIs", label: "X% of Y", placeholderA: "Percentage (e.g. 15)", placeholderB: "Number (e.g. 200)" },
        { key: "isWhatPercent", label: "X is ?% of Y", placeholderA: "Number (e.g. 30)", placeholderB: "Total (e.g. 200)" },
        { key: "change", label: "% Change", placeholderA: "From (e.g. 80)", placeholderB: "To (e.g. 100)" },
    ];

    const currentMode = modes.find((m) => m.key === mode);

    return (
        <div className="min-h-screen bg-gray-950 pb-12">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="Percentage Calculator"
                    description="Quick percentage calculations for discounts, tips, grades, and more."
                    breadcrumbs={[{ label: "Calculators", href: "/category/calculator" }, { label: "Percentage Calculator" }]}
                />
            </div>

            <div className="max-w-[480px] mx-auto flex flex-col gap-6">
                {/* Mode selector */}
                <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1">
                    {modes.map((m) => (
                        <button
                            key={m.key}
                            onClick={() => { setMode(m.key); setA(""); setB(""); }}
                            className={`flex-1 p-2.5 text-xs font-medium rounded-lg border-none cursor-pointer transition-all duration-200 ${mode === m.key
                                ? "bg-gray-100 text-gray-900 shadow-sm"
                                : "bg-transparent text-gray-400 hover:text-gray-200"
                                }`}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>

                {/* Inputs */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-7 flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Value A</label>
                        <input
                            type="number"
                            value={a}
                            onChange={(e) => setA(e.target.value)}
                            placeholder={currentMode?.placeholderA}
                            className="w-full px-4 py-3.5 bg-gray-950 border border-gray-800 rounded-xl text-gray-200 text-lg outline-none focus:border-gray-500 transition-colors placeholder:text-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Value B</label>
                        <input
                            type="number"
                            value={b}
                            onChange={(e) => setB(e.target.value)}
                            placeholder={currentMode?.placeholderB}
                            className="w-full px-4 py-3.5 bg-gray-950 border border-gray-800 rounded-xl text-gray-200 text-lg outline-none focus:border-gray-500 transition-colors placeholder:text-gray-700"
                        />
                    </div>
                </div>

                {/* Result */}
                {result && (
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-7 text-center">
                        <p className="text-sm text-gray-400 m-0 mb-2">{result.label}</p>
                        <p className="text-[40px] font-extrabold text-gray-100 m-0 leading-tight">{result.value}</p>
                    </div>
                )}

                <div className="text-center">
                    <button
                        onClick={() => { setA(""); setB(""); }}
                        className="inline-flex items-center gap-1.5 text-sm text-gray-500 bg-transparent border-none cursor-pointer hover:text-gray-300 transition-colors"
                    >
                        <RotateCcw className="w-3.5 h-3.5" /> Reset
                    </button>
                </div>
            </div>
        </div>
    );
}

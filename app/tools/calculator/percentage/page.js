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
        <div className="max-w-[1280px] mx-auto px-6 py-10">
            <ToolHeader
                title="Percentage Calculator"
                description="Quick percentage calculations for discounts, tips, grades, and more."
                breadcrumbs={[{ label: "Calculators", href: "/category/calculator" }, { label: "Percentage Calculator" }]}
            />

            <div className="max-w-[480px] mx-auto flex flex-col gap-6">
                {/* Mode selector */}
                <div className="flex gap-1 bg-[#171a21] border border-gray-800 rounded-xl p-1">
                    {modes.map((m) => (
                        <button
                            key={m.key}
                            onClick={() => { setMode(m.key); setA(""); setB(""); }}
                            className={`flex-1 p-2.5 text-xs font-medium rounded-lg border-none cursor-pointer transition-all duration-200 ${mode === m.key
                                    ? "bg-blue-500 text-white shadow-sm"
                                    : "bg-transparent text-[#9aa0aa] hover:text-gray-200"
                                }`}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>

                {/* Inputs */}
                <div className="bg-[#171a21] border border-gray-800 rounded-2xl p-7 flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#9aa0aa] mb-2">Value A</label>
                        <input
                            type="number"
                            value={a}
                            onChange={(e) => setA(e.target.value)}
                            placeholder={currentMode?.placeholderA}
                            className="w-full px-4 py-3.5 bg-[#1a1e27] border border-gray-800 rounded-xl text-gray-200 text-lg outline-none focus:border-blue-500 transition-colors placeholder:text-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#9aa0aa] mb-2">Value B</label>
                        <input
                            type="number"
                            value={b}
                            onChange={(e) => setB(e.target.value)}
                            placeholder={currentMode?.placeholderB}
                            className="w-full px-4 py-3.5 bg-[#1a1e27] border border-gray-800 rounded-xl text-gray-200 text-lg outline-none focus:border-blue-500 transition-colors placeholder:text-gray-700"
                        />
                    </div>
                </div>

                {/* Result */}
                {result && (
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-7 text-center">
                        <p className="text-sm text-[#9aa0aa] m-0 mb-2">{result.label}</p>
                        <p className="text-[40px] font-extrabold text-blue-500 m-0 leading-tight">{result.value}</p>
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

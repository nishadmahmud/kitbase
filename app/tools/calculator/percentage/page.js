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
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
            <ToolHeader
                title="Percentage Calculator"
                description="Quick percentage calculations for discounts, tips, grades, and more."
                breadcrumbs={[{ label: "Calculators", href: "/category/calculator" }, { label: "Percentage Calculator" }]}
            />

            <div style={{ maxWidth: "480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Mode selector */}
                <div style={{ display: "flex", gap: "4px", backgroundColor: "#171a21", border: "1px solid #2a2f3a", borderRadius: "12px", padding: "4px" }}>
                    {modes.map((m) => (
                        <button
                            key={m.key}
                            onClick={() => { setMode(m.key); setA(""); setB(""); }}
                            style={{
                                flex: 1, padding: "10px", fontSize: "12px", fontWeight: 500, borderRadius: "8px",
                                border: "none", cursor: "pointer", transition: "all 0.2s",
                                backgroundColor: mode === m.key ? "#4f8cff" : "transparent",
                                color: mode === m.key ? "white" : "#9aa0aa",
                            }}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>

                {/* Inputs */}
                <div style={{ backgroundColor: "#171a21", border: "1px solid #2a2f3a", borderRadius: "16px", padding: "28px", display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#9aa0aa", marginBottom: "8px" }}>Value A</label>
                        <input
                            type="number"
                            value={a}
                            onChange={(e) => setA(e.target.value)}
                            placeholder={currentMode?.placeholderA}
                            style={{
                                width: "100%", padding: "14px 16px", backgroundColor: "#1a1e27", border: "1px solid #2a2f3a",
                                borderRadius: "12px", color: "#e6e8ee", fontSize: "18px", outline: "none", boxSizing: "border-box",
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#9aa0aa", marginBottom: "8px" }}>Value B</label>
                        <input
                            type="number"
                            value={b}
                            onChange={(e) => setB(e.target.value)}
                            placeholder={currentMode?.placeholderB}
                            style={{
                                width: "100%", padding: "14px 16px", backgroundColor: "#1a1e27", border: "1px solid #2a2f3a",
                                borderRadius: "12px", color: "#e6e8ee", fontSize: "18px", outline: "none", boxSizing: "border-box",
                            }}
                        />
                    </div>
                </div>

                {/* Result */}
                {result && (
                    <div style={{ backgroundColor: "rgba(79,140,255,0.05)", border: "1px solid rgba(79,140,255,0.2)", borderRadius: "16px", padding: "28px", textAlign: "center" }}>
                        <p style={{ fontSize: "14px", color: "#9aa0aa", margin: "0 0 8px" }}>{result.label}</p>
                        <p style={{ fontSize: "40px", fontWeight: 800, color: "#4f8cff", margin: 0 }}>{result.value}</p>
                    </div>
                )}

                <div style={{ textAlign: "center" }}>
                    <button
                        onClick={() => { setA(""); setB(""); }}
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}
                    >
                        <RotateCcw style={{ width: "14px", height: "14px" }} /> Reset
                    </button>
                </div>
            </div>
        </div>
    );
}

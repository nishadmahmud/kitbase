"use client";

import { useState, useMemo } from "react";
import { Copy, Plus, Minus, MoveRight } from "lucide-react";
import { diffChars, diffWords, diffLines } from "diff";
import ToolHeader from "@/components/tool/ToolHeader";
import { ActionButton } from "@/components/tool/ToolActions";

const MODES = [
    { id: "chars", label: "Characters" },
    { id: "words", label: "Words" },
    { id: "lines", label: "Lines" },
];

export default function TextDiffPage() {
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
        // Just copying new text for now, or maybe a formatted diff? 
        // Standard behavior is usually just copying the merged result or allowing copy of specific parts.
        // Let's copy the new text.
        navigator.clipboard.writeText(newText);
        alert("New text copied to clipboard!");
    };

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
            <ToolHeader
                title="Text Diff Viewer"
                description="Compare two blocks of text and highlight the differences."
                breadcrumbs={[{ label: "Dev Tools", href: "/category/dev" }, { label: "Text Diff" }]}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Controls */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#171a21", padding: "16px 24px", borderRadius: "16px", border: "1px solid #2a2f3a" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                        {MODES.map(m => (
                            <button
                                key={m.id}
                                onClick={() => setMode(m.id)}
                                style={{
                                    padding: "8px 16px", borderRadius: "8px", border: "1px solid",
                                    borderColor: mode === m.id ? "#4f8cff" : "#3f4451",
                                    backgroundColor: mode === m.id ? "rgba(79, 140, 255, 0.1)" : "#2a2f3a",
                                    color: mode === m.id ? "#4f8cff" : "#e6e8ee",
                                    cursor: "pointer", fontSize: "13px", fontWeight: 600
                                }}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                    <div style={{ color: "#9aa0aa", fontSize: "14px" }}>
                        <span style={{ color: "#ef4444", fontWeight: 600 }}>- Removed</span>
                        <span style={{ margin: "0 8px" }}>•</span>
                        <span style={{ color: "#22c55e", fontWeight: 600 }}>+ Added</span>
                    </div>
                </div>

                {/* Input Area */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", minHeight: "300px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <label style={{ fontSize: "14px", fontWeight: 600, color: "#9aa0aa", textTransform: "uppercase" }}>Original Text</label>
                        <textarea
                            value={oldText}
                            onChange={(e) => setOldText(e.target.value)}
                            style={{
                                flex: 1, padding: "16px", borderRadius: "12px", border: "1px solid #2a2f3a",
                                backgroundColor: "#0f1115", color: "#e6e8ee", outline: "none", resize: "none",
                                fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "14px", lineHeight: "1.6"
                            }}
                            placeholder="Paste original text here..."
                        />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <label style={{ fontSize: "14px", fontWeight: 600, color: "#9aa0aa", textTransform: "uppercase" }}>New Text</label>
                        <textarea
                            value={newText}
                            onChange={(e) => setNewText(e.target.value)}
                            style={{
                                flex: 1, padding: "16px", borderRadius: "12px", border: "1px solid #2a2f3a",
                                backgroundColor: "#0f1115", color: "#e6e8ee", outline: "none", resize: "none",
                                fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "14px", lineHeight: "1.6"
                            }}
                            placeholder="Paste new text here..."
                        />
                    </div>
                </div>

                {/* Diff Output */}
                <div style={{ backgroundColor: "#171a21", borderRadius: "16px", border: "1px solid #2a2f3a", overflow: "hidden" }}>
                    <div style={{ padding: "12px 24px", borderBottom: "1px solid #2a2f3a", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#1a1e27" }}>
                        <span style={{ fontSize: "12px", fontWeight: 600, color: "#9aa0aa", textTransform: "uppercase", letterSpacing: "0.05em" }}>Difference Result</span>
                        <button onClick={copyResult} style={{ background: "none", border: "none", color: "#4f8cff", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 500 }}>
                            <Copy size={14} /> Copy New Text
                        </button>
                    </div>
                    <div style={{
                        padding: "24px",
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        fontSize: "14px",
                        lineHeight: "1.6",
                        whiteSpace: "pre-wrap",
                        color: "#e6e8ee"
                    }}>
                        {differences.map((part, index) => {
                            const color = part.added ? "#22c55e" : part.removed ? "#ef4444" : "inherit";
                            const bg = part.added ? "rgba(34, 197, 94, 0.1)" : part.removed ? "rgba(239, 68, 68, 0.1)" : "transparent";
                            const decoration = part.removed ? "line-through" : "none";
                            return (
                                <span key={index} style={{ color, backgroundColor: bg, textDecoration: decoration }}>
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

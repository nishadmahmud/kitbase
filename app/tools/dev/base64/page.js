"use client";

import { useState, useCallback } from "react";
import { Copy, ArrowRightLeft } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolActions, { ActionButton } from "@/components/tool/ToolActions";

export default function Base64Page() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState("encode");
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleProcess = useCallback(() => {
        setError(null);
        try {
            if (mode === "encode") {
                setOutput(btoa(unescape(encodeURIComponent(input))));
            } else {
                setOutput(decodeURIComponent(escape(atob(input))));
            }
        } catch (e) {
            setError("Invalid input for " + (mode === "encode" ? "encoding" : "decoding"));
            setOutput("");
        }
    }, [input, mode]);

    const handleCopy = useCallback(async () => {
        await navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [output]);

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
            <ToolHeader
                title="Base64 Encoder / Decoder"
                description="Encode and decode Base64 strings quickly in your browser."
                breadcrumbs={[{ label: "Text & Dev Tools", href: "/category/dev" }, { label: "Base64" }]}
            />

            <div style={{ maxWidth: "720px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Mode toggle */}
                <div style={{ display: "flex", gap: "4px", backgroundColor: "#171a21", border: "1px solid #2a2f3a", borderRadius: "12px", padding: "4px" }}>
                    {["encode", "decode"].map((m) => (
                        <button
                            key={m}
                            onClick={() => { setMode(m); setOutput(""); setError(null); }}
                            style={{
                                flex: 1, padding: "10px", fontSize: "14px", fontWeight: 500, borderRadius: "8px",
                                border: "none", cursor: "pointer", transition: "all 0.2s",
                                backgroundColor: mode === m ? "#4f8cff" : "transparent",
                                color: mode === m ? "white" : "#9aa0aa",
                            }}
                        >
                            {m === "encode" ? "Encode" : "Decode"}
                        </button>
                    ))}
                </div>

                {/* Input */}
                <div style={{ backgroundColor: "#171a21", border: "1px solid #2a2f3a", borderRadius: "16px", overflow: "hidden" }}>
                    <div style={{ padding: "12px 20px", borderBottom: "1px solid #2a2f3a", fontSize: "12px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {mode === "encode" ? "Text Input" : "Base64 Input"}
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 to decode..."}
                        style={{
                            width: "100%", height: "160px", padding: "20px", backgroundColor: "transparent",
                            color: "#e6e8ee", fontSize: "14px", fontFamily: "monospace", lineHeight: 1.7,
                            border: "none", outline: "none", resize: "none", boxSizing: "border-box",
                        }}
                        spellCheck={false}
                    />
                </div>

                <ToolActions>
                    <ActionButton onClick={handleProcess} icon={ArrowRightLeft} disabled={!input.trim()}>
                        {mode === "encode" ? "Encode" : "Decode"}
                    </ActionButton>
                </ToolActions>

                {error && (
                    <div style={{ padding: "16px 20px", backgroundColor: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "12px", fontSize: "14px", color: "#f87171" }}>
                        {error}
                    </div>
                )}

                {output && (
                    <div style={{ backgroundColor: "#171a21", border: "1px solid #2a2f3a", borderRadius: "16px", overflow: "hidden" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: "1px solid #2a2f3a" }}>
                            <span style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                {mode === "encode" ? "Base64 Output" : "Text Output"}
                            </span>
                            <button
                                onClick={handleCopy}
                                style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#4f8cff", background: "none", border: "none", cursor: "pointer" }}
                            >
                                <Copy style={{ width: "14px", height: "14px" }} />{copied ? "Copied!" : "Copy"}
                            </button>
                        </div>
                        <pre style={{ padding: "20px", margin: 0, color: "#e6e8ee", fontSize: "14px", fontFamily: "monospace", lineHeight: 1.7, overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                            {output}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}

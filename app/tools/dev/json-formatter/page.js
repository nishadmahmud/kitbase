"use client";

import { useState, useCallback } from "react";
import { Braces, Copy, Check, AlertTriangle } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolActions, { ActionButton } from "@/components/tool/ToolActions";
import { formatJson, minifyJson, validateJson } from "@/lib/dev/json";

const sampleJson = `{
  "name": "Kitbase",
  "version": "1.0.0",
  "features": ["PDF", "Image", "Markdown", "JSON"],
  "settings": {
    "theme": "dark",
    "privacy": true
  }
}`;

export default function JsonFormatterPage() {
    const [input, setInput] = useState(sampleJson);
    const [output, setOutput] = useState("");
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [validation, setValidation] = useState(null);

    const handleFormat = useCallback(() => {
        setError(null);
        setValidation(null);
        try {
            setOutput(formatJson(input));
        } catch (e) {
            setError(e.message);
        }
    }, [input]);

    const handleMinify = useCallback(() => {
        setError(null);
        setValidation(null);
        try {
            setOutput(minifyJson(input));
        } catch (e) {
            setError(e.message);
        }
    }, [input]);

    const handleValidate = useCallback(() => {
        setError(null);
        const result = validateJson(input);
        setValidation(result);
    }, [input]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(output || input);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
            <ToolHeader
                title="JSON Formatter"
                description="Prettify and validate complex JSON data for better readability."
                breadcrumbs={[{ label: "Text & Dev Tools", href: "/category/dev" }, { label: "JSON Formatter" }]}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", minHeight: "400px" }}>
                {/* Input */}
                <div style={{ backgroundColor: "#171a21", border: "1px solid #2a2f3a", borderRadius: "16px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    <div style={{ padding: "12px 20px", borderBottom: "1px solid #2a2f3a", fontSize: "12px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Input
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        spellCheck={false}
                        style={{
                            flex: 1, padding: "20px", backgroundColor: "transparent",
                            color: "#e6e8ee", fontSize: "14px", fontFamily: "var(--font-jetbrains-mono), monospace",
                            lineHeight: 1.7, border: "none", outline: "none", resize: "none",
                        }}
                    />
                </div>

                {/* Output */}
                <div style={{ backgroundColor: "#171a21", border: "1px solid #2a2f3a", borderRadius: "16px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    <div style={{ padding: "12px 20px", borderBottom: "1px solid #2a2f3a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Output</span>
                        <button
                            onClick={handleCopy}
                            style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#4f8cff", background: "none", border: "none", cursor: "pointer" }}
                        >
                            {copied ? <Check style={{ width: "14px", height: "14px" }} /> : <Copy style={{ width: "14px", height: "14px" }} />}
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                    <pre style={{
                        flex: 1, padding: "20px", margin: 0,
                        color: "#e6e8ee", fontSize: "14px", fontFamily: "var(--font-jetbrains-mono), monospace",
                        lineHeight: 1.7, overflowY: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word",
                    }}>
                        {output || "Output will appear here..."}
                    </pre>
                </div>
            </div>

            {error && (
                <div style={{ marginTop: "16px", padding: "16px 20px", backgroundColor: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "12px", fontSize: "14px", color: "#f87171", display: "flex", alignItems: "center", gap: "8px" }}>
                    <AlertTriangle style={{ width: "16px", height: "16px", flexShrink: 0 }} /> {error}
                </div>
            )}

            {validation && (
                <div style={{
                    marginTop: "16px", padding: "16px 20px", borderRadius: "12px", fontSize: "14px",
                    backgroundColor: validation.valid ? "rgba(52,211,153,0.05)" : "rgba(248,113,113,0.05)",
                    border: `1px solid ${validation.valid ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)"}`,
                    color: validation.valid ? "#34d399" : "#f87171",
                }}>
                    {validation.valid ? "✓ Valid JSON" : `✗ Invalid: ${validation.error}`}
                </div>
            )}

            <ToolActions>
                <ActionButton onClick={handleFormat} icon={Braces}>Format</ActionButton>
                <ActionButton onClick={handleMinify} variant="secondary">Minify</ActionButton>
                <ActionButton onClick={handleValidate} variant="secondary">Validate</ActionButton>
            </ToolActions>
        </div>
    );
}

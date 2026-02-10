"use client";

import { useState, useMemo } from "react";
import { Copy, Download, FileText, BarChart3 } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolActions, { ActionButton } from "@/components/tool/ToolActions";
import { parseMarkdown } from "@/lib/markdown/parse";

const defaultMd = `# Welcome to Markdown Viewer

Write or paste your **markdown** here and see it rendered in real-time.

## Features
- Live preview
- GitHub-flavoured Markdown
- Code block highlighting
- Export to HTML

\`\`\`js
console.log("Hello, Kitbase!");
\`\`\`

> Privacy first — everything stays in your browser.
`;

export default function MarkdownViewerPage() {
    const [md, setMd] = useState(defaultMd);
    const [copied, setCopied] = useState(false);

    const html = useMemo(() => parseMarkdown(md), [md]);
    const wordCount = md.trim().split(/\s+/).filter(Boolean).length;
    const lineCount = md.split("\n").length;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(html);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleExport = () => {
        const fullHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Markdown Export</title><style>body{font-family:system-ui,sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#e6e8ee;background:#0f1115}pre{background:#171a21;padding:1rem;border-radius:8px;overflow-x:auto}code{font-family:monospace}a{color:#4f8cff}blockquote{border-left:3px solid #4f8cff;margin-left:0;padding-left:1rem;color:#9aa0aa}</style></head><body>${html}</body></html>`;
        const blob = new Blob([fullHtml], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "kitbase-markdown.html";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
            <ToolHeader
                title="Markdown Viewer"
                description="Live preview and edit your markdown files with real-time rendering."
                breadcrumbs={[{ label: "Text & Dev Tools", href: "/category/dev" }, { label: "Markdown Viewer" }]}
            />

            {/* Stats bar */}
            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px", fontSize: "13px", color: "#6b7280" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <BarChart3 style={{ width: "14px", height: "14px" }} /> {wordCount} words · {lineCount} lines
                </span>
            </div>

            {/* Editor + Preview */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", minHeight: "480px" }}>
                {/* Editor */}
                <div style={{ backgroundColor: "#171a21", border: "1px solid #2a2f3a", borderRadius: "16px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    <div style={{ padding: "12px 20px", borderBottom: "1px solid #2a2f3a", fontSize: "12px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Editor
                    </div>
                    <textarea
                        value={md}
                        onChange={(e) => setMd(e.target.value)}
                        spellCheck={false}
                        style={{
                            flex: 1, padding: "20px", backgroundColor: "transparent",
                            color: "#e6e8ee", fontSize: "14px", fontFamily: "var(--font-jetbrains-mono), monospace",
                            lineHeight: 1.7, border: "none", outline: "none", resize: "none",
                        }}
                    />
                </div>

                {/* Preview */}
                <div style={{ backgroundColor: "#171a21", border: "1px solid #2a2f3a", borderRadius: "16px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    <div style={{ padding: "12px 20px", borderBottom: "1px solid #2a2f3a", fontSize: "12px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Preview
                    </div>
                    <div className="markdown-body"
                        dangerouslySetInnerHTML={{ __html: html }}
                        style={{
                            flex: 1, padding: "20px", fontSize: "14px", lineHeight: 1.8,
                            color: "#e6e8ee", overflowY: "auto",
                        }}
                    />
                    <style jsx global>{`
                        .markdown-body h1 { font-size: 2em; font-weight: 800; border-bottom: 1px solid #2a2f3a; padding-bottom: 0.3em; margin-top: 24px; margin-bottom: 16px; color: #e6e8ee; }
                        .markdown-body h2 { font-size: 1.5em; font-weight: 700; border-bottom: 1px solid #2a2f3a; padding-bottom: 0.3em; margin-top: 24px; margin-bottom: 16px; color: #e6e8ee; }
                        .markdown-body h3 { font-size: 1.25em; font-weight: 600; margin-top: 24px; margin-bottom: 16px; color: #e6e8ee; }
                        .markdown-body h4 { font-size: 1em; font-weight: 600; margin-top: 24px; margin-bottom: 16px; color: #e6e8ee; }
                        .markdown-body h5 { font-size: 0.875em; font-weight: 600; margin-top: 24px; margin-bottom: 16px; color: #e6e8ee; }
                        .markdown-body h6 { font-size: 0.85em; font-weight: 600; color: #6a737d; margin-top: 24px; margin-bottom: 16px; }
                        
                        .markdown-body p { margin-bottom: 16px; }
                        .markdown-body ul, .markdown-body ol { padding-left: 2em; margin-bottom: 16px; }
                        .markdown-body ul { list-style-type: disc; }
                        .markdown-body ol { list-style-type: decimal; }
                        .markdown-body li { margin-bottom: 4px; }
                        .markdown-body li > p { margin-top: 16px; }
                        
                        .markdown-body blockquote { margin: 0 0 16px; padding: 0 1em; color: #9aa0aa; border-left: 0.25em solid #30363d; }
                        
                        .markdown-body code { padding: 0.2em 0.4em; margin: 0; font-size: 85%; background-color: rgba(110,118,129,0.4); border-radius: 6px; font-family: var(--font-jetbrains-mono), monospace; }
                        .markdown-body pre { padding: 16px; overflow: auto; font-size: 85%; line-height: 1.45; background-color: #0d1117; border-radius: 6px; margin-bottom: 16px; border: 1px solid #30363d; }
                        .markdown-body pre code { background-color: transparent; padding: 0; margin: 0; font-size: 100%; word-break: normal; white-space: pre; border: 0; }
                        
                        .markdown-body a { color: #4f8cff; text-decoration: none; }
                        .markdown-body a:hover { text-decoration: underline; }
                        
                        .markdown-body img { max-width: 100%; box-sizing: content-box; background-color: #0d1117; }
                        
                        .markdown-body hr { height: 0.25em; padding: 0; margin: 24px 0; background-color: #30363d; border: 0; }
                        
                        .markdown-body table { border-spacing: 0; border-collapse: collapse; margin-bottom: 16px; width: 100%; overflow: auto; }
                        .markdown-body table th, .markdown-body table td { padding: 6px 13px; border: 1px solid #30363d; }
                        .markdown-body table th { fontWeight: 600; background-color: #161b22; }
                        .markdown-body table tr { background-color: #0d1117; border-top: 1px solid #21262d; }
                        .markdown-body table tr:nth-child(2n) { background-color: #161b22; }
                    `}</style>
                </div>
            </div>

            <ToolActions>
                <ActionButton onClick={handleCopy} icon={Copy} variant="secondary">
                    {copied ? "Copied!" : "Copy HTML"}
                </ActionButton>
                <ActionButton onClick={handleExport} icon={Download} variant="secondary">
                    Export HTML
                </ActionButton>
            </ToolActions>
        </div>
    );
}

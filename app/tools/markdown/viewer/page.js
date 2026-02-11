"use client";

import { useState, useMemo } from "react";
import { Copy, Download, BarChart3 } from "lucide-react";
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
        <div className="max-w-[1280px] mx-auto px-6 py-10">
            <ToolHeader
                title="Markdown Viewer"
                description="Live preview and edit your markdown files with real-time rendering."
                breadcrumbs={[{ label: "Text & Dev Tools", href: "/category/dev" }, { label: "Markdown Viewer" }]}
            />

            {/* Stats bar */}
            <div className="flex items-center gap-5 mb-5 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                    <BarChart3 className="w-3.5 h-3.5" /> {wordCount} words · {lineCount} lines
                </span>
            </div>

            {/* Editor + Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 min-h-[480px]">
                {/* Editor */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
                    <div className="px-5 py-3 border-b border-gray-800 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-950">
                        Editor
                    </div>
                    <textarea
                        value={md}
                        onChange={(e) => setMd(e.target.value)}
                        spellCheck={false}
                        className="flex-1 p-5 bg-transparent text-gray-200 text-sm font-mono leading-relaxed border-none outline-none resize-none"
                    />
                </div>

                {/* Preview */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
                    <div className="px-5 py-3 border-b border-gray-800 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-950">
                        Preview
                    </div>
                    <div className="markdown-body flex-1 p-5 text-sm leading-[1.8] text-gray-200 overflow-y-auto"
                        dangerouslySetInnerHTML={{ __html: html }}
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
                        
                        .markdown-body a { color: #94a3b8; text-decoration: none; }
                        .markdown-body a:hover { text-decoration: underline; }
                        
                        .markdown-body img { max-width: 100%; box-sizing: content-box; background-color: #0d1117; }
                        
                        .markdown-body hr { height: 0.25em; padding: 0; margin: 24px 0; background-color: #30363d; border: 0; }
                        
                        .markdown-body table { border-spacing: 0; border-collapse: collapse; margin-bottom: 16px; width: 100%; overflow: auto; }
                        .markdown-body table th, .markdown-body table td { padding: 6px 13px; border: 1px solid #30363d; }
                        .markdown-body table th { font-weight: 600; background-color: #161b22; }
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

"use client";

import { useState, useRef, useEffect } from "react";
import Script from "next/script";
import { FileDown, FileText, Download } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolActions, { ActionButton } from "@/components/tool/ToolActions";
import { parseMarkdown } from "@/lib/markdown/parse";

export default function MarkdownToPdfPage() {
    const [input, setInput] = useState(`# Project Title

A brief description of what this project does and who it's for.

## Features
- Fast processing
- Secure and private
- Easy to use

## Code Example
\`\`\`js
console.log("Hello, World!");
\`\`\`
`);
    const [html, setHtml] = useState("");
    const [loading, setLoading] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        setHtml(parseMarkdown(input));
    }, [input]);

    const handleDownload = () => {
        // Check if html2pdf is loaded
        if (typeof window === "undefined" || !window.html2pdf) {
            alert("PDF generation library is still loading. Please try again in 3 seconds.");
            return;
        }

        setLoading(true);
        const element = contentRef.current;
        const opt = {
            margin: [0.5, 0.5],
            filename: 'kitbase-document.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        window.html2pdf().set(opt).from(element).save().then(() => {
            setLoading(false);
        }).catch((err) => {
            console.error(err);
            setLoading(false);
            alert("Failed to generate PDF. Check console for details.");
        });
    };

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
            <Script
                src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
                strategy="lazyOnload"
            />

            <ToolHeader
                title="Markdown to PDF"
                description="Convert your markdown notes into professional PDF documents."
                breadcrumbs={[{ label: "Dev Tools", href: "/category/dev" }, { label: "Markdown to PDF" }]}
            />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "24px", minHeight: "600px" }}>
                {/* Editor */}
                <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#171a21", border: "1px solid #2a2f3a", borderRadius: "16px", overflow: "hidden", height: "600px" }}>
                    <div style={{ padding: "12px 20px", borderBottom: "1px solid #2a2f3a", backgroundColor: "#1a1e27" }}>
                        <span style={{ fontSize: "12px", fontWeight: 600, color: "#9aa0aa", textTransform: "uppercase", letterSpacing: "0.05em" }}>Editor (Markdown)</span>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        style={{
                            flex: 1, width: "100%", resize: "none", backgroundColor: "transparent", border: "none",
                            padding: "20px", color: "#e6e8ee", fontSize: "14px", fontFamily: "var(--font-jetbrains-mono), monospace", outline: "none",
                        }}
                        placeholder="# Start writing..."
                    />
                </div>

                {/* Preview / PDF Target */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", height: "600px" }}>
                    <div style={{
                        flex: 1, backgroundColor: "white", borderRadius: "16px", overflow: "hidden",
                        display: "flex", flexDirection: "column", position: "relative", border: "1px solid #2a2f3a"
                    }}>
                        <div style={{
                            padding: "12px 20px", backgroundColor: "#f3f4f6", borderBottom: "1px solid #e5e7eb",
                            fontSize: "12px", fontWeight: 600, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.05em",
                            display: "flex", justifyContent: "space-between", alignItems: "center"
                        }}>
                            <span>PDF Preview</span>
                        </div>

                        <div style={{ flex: 1, overflowY: "auto", padding: "20px", backgroundColor: "white" }}>
                            <div ref={contentRef} className="pdf-content" dangerouslySetInnerHTML={{ __html: html }} />
                        </div>
                    </div>

                    <ActionButton onClick={handleDownload} loading={loading} icon={FileDown} fullWidth>
                        Download PDF
                    </ActionButton>
                </div>
            </div>

            <style jsx global>{`
                /* PDF Preview Styles (Scoped to .pdf-content to ensure WHAT YOU SEE IS WHAT YOU GET) */
                .pdf-content { color: #111827; font-family: -apple-system, system-ui, sans-serif; line-height: 1.6; }
                .pdf-content h1 { font-size: 2em; font-weight: 800; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.3em; margin-top: 0; margin-bottom: 16px; color: #111827; }
                .pdf-content h2 { font-size: 1.5em; font-weight: 700; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.3em; margin-top: 24px; margin-bottom: 16px; color: #111827; }
                .pdf-content h3 { font-size: 1.25em; font-weight: 600; margin-top: 24px; margin-bottom: 16px; color: #111827; }
                .pdf-content p { margin-bottom: 16px; }
                .pdf-content ul, .pdf-content ol { padding-left: 2em; margin-bottom: 16px; }
                .pdf-content li { margin-bottom: 4px; }
                .pdf-content blockquote { margin: 0 0 16px; padding: 0 1em; color: #4b5563; border-left: 0.25em solid #e5e7eb; font-style: italic; }
                .pdf-content code { padding: 0.2em 0.4em; margin: 0; font-size: 85%; background-color: #f3f4f6; border-radius: 6px; font-family: monospace; color: #111827; }
                .pdf-content pre { padding: 16px; overflow: auto; font-size: 85%; line-height: 1.45; background-color: #f3f4f6; border-radius: 6px; margin-bottom: 16px; border: 1px solid #e5e7eb; }
                .pdf-content pre code { background-color: transparent; padding: 0; color: inherit; }
                .pdf-content a { color: #2563eb; text-decoration: none; }
                .pdf-content img { max-width: 100%; }
                .pdf-content table { border-collapse: collapse; width: 100%; margin-bottom: 16px; }
                .pdf-content th, .pdf-content td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
                .pdf-content th { background-color: #f9fafb; font-weight: 600; }
            `}</style>
        </div>
    );
}

"use client";

import { useState, useRef, useEffect } from "react";
import Script from "next/script";
import { FileDown, Settings, ChevronDown, Minus, Plus, Search } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import { ActionButton } from "@/components/tool/ToolActions";
import { parseMarkdown } from "@/lib/markdown/parse";

const PAPER_SIZES = {
    a4: { name: "A4", width: 210, height: 297, unit: "mm", format: "a4" },
    letter: { name: "Letter", width: 215.9, height: 279.4, unit: "mm", format: "letter" },
    legal: { name: "Legal", width: 215.9, height: 355.6, unit: "mm", format: "legal" },
};

const MARGINS = {
    none: { name: "None", value: "0mm" },
    small: { name: "Small", value: "10mm" },
    normal: { name: "Normal", value: "20mm" },
    large: { name: "Large", value: "30mm" },
};

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
    const [paperSize, setPaperSize] = useState("a4");
    const [marginSize, setMarginSize] = useState("normal");
    const [zoom, setZoom] = useState(0.7);

    const contentRef = useRef(null);

    useEffect(() => {
        setHtml(parseMarkdown(input));
    }, [input]);

    const handleDownload = () => {
        if (typeof window === "undefined" || !window.html2pdf) {
            alert("PDF generation library is still loading. Please try again.");
            return;
        }

        setLoading(true);
        const element = contentRef.current;

        const currentSize = PAPER_SIZES[paperSize];

        const opt = {
            margin: 0,
            filename: 'kitbase-document.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true,
                scrollY: 0,
                windowWidth: element.offsetWidth,
            },
            jsPDF: { unit: 'mm', format: currentSize.format, orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        const clone = element.cloneNode(true);
        clone.style.transform = "none";
        // Ensure clone has correct physical dimensions
        clone.style.width = `${currentSize.width}${currentSize.unit}`;
        clone.style.minHeight = `${currentSize.height}${currentSize.unit}`;

        const container = document.createElement("div");
        container.style.position = "absolute";
        container.style.left = "-9999px";
        container.style.top = "0";
        container.appendChild(clone);
        document.body.appendChild(container);

        window.html2pdf().set(opt).from(clone).save().then(() => {
            document.body.removeChild(container);
            setLoading(false);
        }).catch((err) => {
            console.error(err);
            if (document.body.contains(container)) document.body.removeChild(container);
            setLoading(false);
            alert("Failed to generate PDF. Check console for details.");
        });
    };

    const currentPaper = PAPER_SIZES[paperSize];

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

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "24px", minHeight: "800px" }}>
                {/* Editor */}
                <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#171a21", border: "1px solid #2a2f3a", borderRadius: "16px", overflow: "hidden", height: "800px" }}>
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
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", height: "800px" }}>
                    <div style={{
                        flex: 1, backgroundColor: "#52565e", borderRadius: "16px", overflow: "hidden",
                        display: "flex", flexDirection: "column", position: "relative", border: "1px solid #2a2f3a"
                    }}>
                        {/* Preview Toolbar */}
                        <div style={{
                            padding: "12px 20px", backgroundColor: "#1a1e27", borderBottom: "1px solid #2a2f3a",
                            display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px",
                            zIndex: 10, position: "relative"
                        }}>
                            <span style={{ fontSize: "12px", fontWeight: 600, color: "#9aa0aa", textTransform: "uppercase", letterSpacing: "0.05em" }}>PDF Preview</span>

                            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                {/* Zoom Controls */}
                                <div style={{ display: "flex", alignItems: "center", backgroundColor: "#2a2f3a", borderRadius: "6px", border: "1px solid #3f4451", padding: "2px 8px" }}>
                                    <button onClick={() => setZoom(z => Math.max(0.3, z - 0.1))} style={{ color: "#e6e8ee", background: "none", border: "none", cursor: "pointer", padding: "4px" }} title="Zoom Out"><Minus size={14} /></button>
                                    <span style={{ fontSize: "12px", fontWeight: 500, color: "#e6e8ee", width: "40px", textAlign: "center" }}>{Math.round(zoom * 100)}%</span>
                                    <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} style={{ color: "#e6e8ee", background: "none", border: "none", cursor: "pointer", padding: "4px" }} title="Zoom In"><Plus size={14} /></button>
                                </div>

                                {/* Paper Size Selector */}
                                <div style={{ position: "relative" }}>
                                    <select
                                        value={paperSize}
                                        onChange={(e) => setPaperSize(e.target.value)}
                                        style={{
                                            appearance: "none", backgroundColor: "#2a2f3a", color: "#e6e8ee",
                                            border: "1px solid #3f4451", borderRadius: "6px", padding: "4px 24px 4px 8px",
                                            fontSize: "12px", fontWeight: 500, cursor: "pointer", outline: "none"
                                        }}
                                    >
                                        {Object.entries(PAPER_SIZES).map(([key, size]) => (
                                            <option key={key} value={key}>{size.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown style={{ width: "12px", height: "12px", position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", color: "#9aa0aa", pointerEvents: "none" }} />
                                </div>

                                {/* Margin Selector */}
                                <div style={{ position: "relative" }}>
                                    <select
                                        value={marginSize}
                                        onChange={(e) => setMarginSize(e.target.value)}
                                        style={{
                                            appearance: "none", backgroundColor: "#2a2f3a", color: "#e6e8ee",
                                            border: "1px solid #3f4451", borderRadius: "6px", padding: "4px 24px 4px 8px",
                                            fontSize: "12px", fontWeight: 500, cursor: "pointer", outline: "none"
                                        }}
                                    >
                                        {Object.entries(MARGINS).map(([key, margin]) => (
                                            <option key={key} value={key}>Margin: {margin.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown style={{ width: "12px", height: "12px", position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", color: "#9aa0aa", pointerEvents: "none" }} />
                                </div>
                            </div>
                        </div>

                        <div style={{ flex: 1, overflow: "auto", position: "relative", backgroundColor: "#52565e", display: "flex", padding: "40px" }}>
                            {/* 
                                Scaled Wrapper Pattern with 'margin: auto' for safe centering
                                If content < container => centered.
                                If content > container => aligns start (scrollable).
                            */}
                            <div
                                style={{
                                    width: `${currentPaper.width * zoom}mm`, // Explicit visual width
                                    height: `${currentPaper.height * zoom}mm`, // Explicit visual height
                                    position: "relative",
                                    flexShrink: 0,
                                    margin: "auto" // This is the key fix for centering + scrolling
                                }}
                            >
                                <div
                                    ref={contentRef}
                                    className="pdf-content"
                                    dangerouslySetInnerHTML={{ __html: html }}
                                    style={{
                                        width: `${currentPaper.width}mm`,
                                        minHeight: `${currentPaper.height}mm`,
                                        backgroundColor: "white",
                                        padding: MARGINS[marginSize].value,
                                        boxShadow: "0 0 15px rgba(0,0,0,0.3)",
                                        color: "black",
                                        boxSizing: "border-box",
                                        // Scaling logic
                                        transform: `scale(${zoom})`,
                                        transformOrigin: "top left",
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        transition: "transform 0.2s ease, width 0.3s ease, min-height 0.3s ease, padding 0.3s ease"
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <ActionButton onClick={handleDownload} loading={loading} icon={FileDown} fullWidth>
                        Download PDF
                    </ActionButton>
                </div>
            </div>

            <style jsx global>{`
                /* PDF Preview Styles (Scoped to .pdf-content) */
                .pdf-content { color: #111827; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; font-size: 11pt; }
                .pdf-content * { box-sizing: border-box; }
                .pdf-content h1 { font-size: 24pt; font-weight: 800; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.3em; margin-top: 0; margin-bottom: 16px; color: #111827; }
                .pdf-content h2 { font-size: 18pt; font-weight: 700; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.3em; margin-top: 24px; margin-bottom: 16px; color: #111827; }
                .pdf-content h3 { font-size: 14pt; font-weight: 600; margin-top: 24px; margin-bottom: 16px; color: #111827; }
                .pdf-content p { margin-bottom: 12px; text-align: justify; }
                .pdf-content ul, .pdf-content ol { padding-left: 2em; margin-bottom: 12px; }
                .pdf-content li { margin-bottom: 4px; }
                .pdf-content blockquote { margin: 0 0 16px; padding: 0 1em; color: #4b5563; border-left: 0.25em solid #e5e7eb; font-style: italic; }
                .pdf-content code { padding: 0.2em 0.4em; margin: 0; font-size: 85%; background-color: #f3f4f6; border-radius: 6px; font-family: "Courier New", Courier, monospace; color: #111827; }
                .pdf-content pre { padding: 16px; overflow: hidden; font-size: 85%; line-height: 1.45; background-color: #f3f4f6; border-radius: 6px; margin-bottom: 16px; border: 1px solid #e5e7eb; white-space: pre-wrap; word-break: break-all; }
                .pdf-content pre code { background-color: transparent; padding: 0; color: inherit; }
                .pdf-content a { color: #2563eb; text-decoration: none; }
                .pdf-content img { max-width: 100%; height: auto; display: block; margin: 16px auto; }
                .pdf-content table { border-collapse: collapse; width: 100%; margin-bottom: 16px; }
                .pdf-content th, .pdf-content td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
                .pdf-content th { background-color: #f9fafb; font-weight: 600; }
                .pdf-content hr { height: 0.25em; padding: 0; margin: 24px 0; background-color: #e1e4e8; border: 0; }
            `}</style>
        </div>
    );
}

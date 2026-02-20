"use client";

import { useState, useRef, useEffect } from "react";
import Script from "next/script";
import { FileDown, Minus, Plus, ChevronDown } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import CustomSelect from "@/components/ui/CustomSelect";
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

export default function MarkdownToPdfClient() {
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
        <div className="min-h-screen pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <Script
                    src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
                    strategy="lazyOnload"
                />

                <ToolHeader
                    title="Markdown to PDF"
                    description="Convert your markdown notes into professional PDF documents."
                    breadcrumbs={[{ label: "Markdown", href: "/category/markdown" }, { label: "Markdown to PDF" }]}
                />

                <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-6 min-h-[800px]">
                    {/* Editor */}
                    <div className="flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden h-[800px] shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                        <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Editor (Markdown)</span>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 w-full bg-transparent border-none p-5 text-gray-900 dark:text-gray-200 text-sm font-mono outline-none resize-none"
                            placeholder="# Start writing..."
                        />
                    </div>

                    {/* Preview / PDF Target */}
                    <div className="flex flex-col gap-4 h-[800px]">
                        <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden flex flex-col relative border border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                            {/* Preview Toolbar */}
                            <div className="px-5 py-3 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 flex flex-wrap justify-between items-center gap-3 z-10 relative">
                                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">PDF Preview</span>

                                <div className="flex gap-3 items-center">
                                    {/* Zoom Controls */}
                                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 px-2 py-0.5">
                                        <button
                                            onClick={() => setZoom(z => Math.max(0.3, z - 0.1))}
                                            className="text-gray-600 dark:text-gray-200 bg-transparent border-none cursor-pointer p-1 hover:text-gray-900 dark:hover:text-white"
                                            title="Zoom Out"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="text-xs font-medium text-gray-700 dark:text-gray-200 w-10 text-center">{Math.round(zoom * 100)}%</span>
                                        <button
                                            onClick={() => setZoom(z => Math.min(2, z + 0.1))}
                                            className="text-gray-600 dark:text-gray-200 bg-transparent border-none cursor-pointer p-1 hover:text-gray-900 dark:hover:text-white"
                                            title="Zoom In"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    <div className="w-32">
                                        <CustomSelect
                                            value={paperSize}
                                            onChange={(e) => setPaperSize(e.target.value)}
                                            options={Object.entries(PAPER_SIZES).map(([key, size]) => ({ value: key, label: size.name }))}
                                            buttonClassName="py-1 text-xs h-8 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                        />
                                    </div>

                                    <div className="w-40">
                                        <CustomSelect
                                            value={marginSize}
                                            onChange={(e) => setMarginSize(e.target.value)}
                                            options={Object.entries(MARGINS).map(([key, margin]) => ({ value: key, label: `Margin: ${margin.name}` }))}
                                            buttonClassName="py-1 text-xs h-8 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-auto relative bg-gray-200 dark:bg-gray-700 flex p-10">
                                {/* 
                                Scaled Wrapper Pattern with 'margin: auto' for safe centering
                                If content < container => centered.
                                If content > container => aligns start (scrollable).
                            */}
                                <div
                                    style={{
                                        width: `${currentPaper.width * zoom}mm`, // Explicit visual width
                                        height: `${currentPaper.height * zoom}mm`, // Explicit visual height
                                    }}
                                    className="relative flex-shrink-0 m-auto"
                                >
                                    <div
                                        ref={contentRef}
                                        className="pdf-content absolute top-0 left-0 bg-white shadow-lg dark:shadow-[0_0_15px_rgba(0,0,0,0.3)] text-black box-border origin-top-left transition-all duration-200"
                                        dangerouslySetInnerHTML={{ __html: html }}
                                        style={{
                                            width: `${currentPaper.width}mm`,
                                            minHeight: `${currentPaper.height}mm`,
                                            padding: MARGINS[marginSize].value,
                                            transform: `scale(${zoom})`,
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
        </div>
    );
}

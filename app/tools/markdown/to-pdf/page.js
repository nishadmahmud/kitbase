"use client";

import { FileDown } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";

export default function MarkdownToPdfPage() {
    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
            <ToolHeader
                title="Markdown to PDF"
                description="Export your markdown documents to beautifully formatted PDF files."
                breadcrumbs={[{ label: "Text & Dev Tools", href: "/category/dev" }, { label: "Markdown to PDF" }]}
            />
            <div style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center", paddingTop: "64px", paddingBottom: "64px" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "16px", backgroundColor: "rgba(79,140,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <FileDown style={{ width: "32px", height: "32px", color: "#4f8cff" }} />
                </div>
                <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#e6e8ee", margin: "0 0 8px" }}>Coming Soon</h2>
                <p style={{ color: "#9aa0aa", margin: 0, fontSize: "15px" }}>
                    Markdown to PDF export is under development. For now, use the{" "}
                    <a href="/tools/markdown/viewer" style={{ color: "#4f8cff", textDecoration: "underline" }}>Markdown Viewer</a>{" "}
                    to preview and copy your content.
                </p>
            </div>
        </div>
    );
}

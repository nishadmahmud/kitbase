"use client";

import Link from "next/link";
import { categories, tools as allTools } from "@/lib/toolsRegistry";

export default function AllToolsPage() {
    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "48px 24px" }}>
            <div style={{ marginBottom: "48px" }}>
                <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#e6e8ee", margin: 0 }}>All Tools</h1>
                <p style={{ marginTop: "8px", marginBottom: 0, color: "#9aa0aa", fontSize: "16px" }}>Browse every tool available on Kitbase.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "56px" }}>
                {categories.map((cat) => {
                    const Icon = cat.icon;
                    const tools = allTools.filter((t) => t.category === cat.slug);
                    return (
                        <div key={cat.slug}>
                            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
                                <div
                                    style={{
                                        width: "44px", height: "44px", borderRadius: "12px",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        backgroundColor: `${cat.color}15`,
                                    }}
                                >
                                    <Icon style={{ width: "22px", height: "22px", color: cat.color }} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#e6e8ee", margin: 0 }}>{cat.name}</h2>
                                    <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>{tools.length} tools</p>
                                </div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
                                {tools.map((tool) => {
                                    const ToolIcon = tool.icon;
                                    return (
                                        <Link
                                            key={tool.href}
                                            href={tool.href}
                                            style={{
                                                display: "flex", alignItems: "center", gap: "16px",
                                                backgroundColor: "#171a21", border: "1px solid #2a2f3a",
                                                borderRadius: "14px", padding: "20px 24px",
                                                textDecoration: "none", transition: "all 0.2s",
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3a4050"; e.currentTarget.style.backgroundColor = "#1e2230"; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a2f3a"; e.currentTarget.style.backgroundColor = "#171a21"; }}
                                        >
                                            <div style={{ width: "44px", height: "44px", borderRadius: "10px", backgroundColor: "rgba(79,140,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                <ToolIcon style={{ width: "22px", height: "22px", color: "#4f8cff" }} />
                                            </div>
                                            <div style={{ minWidth: 0 }}>
                                                <h3 style={{ fontWeight: 600, color: "#e6e8ee", fontSize: "15px", margin: 0 }}>{tool.name}</h3>
                                                <p style={{ fontSize: "13px", color: "#6b7280", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tool.description}</p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

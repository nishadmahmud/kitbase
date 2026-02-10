"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { categories, getToolsByCategory } from "@/lib/toolsRegistry";

export default function CategoryPage() {
    const { slug } = useParams();
    const category = categories.find((c) => c.slug === slug);

    if (!category) {
        return (
            <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
                <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#e6e8ee" }}>Category not found</h1>
                <Link href="/all-tools" style={{ color: "#4f8cff", textDecoration: "none", marginTop: "16px", display: "inline-block" }}>Browse all tools</Link>
            </div>
        );
    }

    const tools = getToolsByCategory(slug);
    const Icon = category.icon;

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "48px 24px" }}>
            <nav style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>
                <Link href="/" style={{ color: "#6b7280", textDecoration: "none" }}>Home</Link>
                <span style={{ margin: "0 8px" }}>›</span>
                <Link href="/all-tools" style={{ color: "#6b7280", textDecoration: "none" }}>All Tools</Link>
                <span style={{ margin: "0 8px" }}>›</span>
                <span style={{ color: "#4f8cff" }}>{category.name}</span>
            </nav>

            <div style={{
                backgroundColor: "#171a21", border: "1px solid #2a2f3a",
                borderRadius: "20px", padding: "36px", marginBottom: "48px",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                    <div style={{
                        width: "64px", height: "64px", borderRadius: "16px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        backgroundColor: `${category.color}15`,
                    }}>
                        <Icon style={{ width: "32px", height: "32px", color: category.color }} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#e6e8ee", margin: 0 }}>{category.name}</h1>
                        <p style={{ color: "#9aa0aa", margin: "6px 0 0", fontSize: "15px" }}>
                            {tools.length} tools available · {category.tags.join(", ")}
                        </p>
                    </div>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                {tools.map((tool) => {
                    const ToolIcon = tool.icon;
                    return (
                        <Link
                            key={tool.href}
                            href={tool.href}
                            style={{
                                backgroundColor: "#171a21", border: "1px solid #2a2f3a",
                                borderRadius: "16px", padding: "28px",
                                textDecoration: "none", transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3a4050"; e.currentTarget.style.backgroundColor = "#1e2230"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a2f3a"; e.currentTarget.style.backgroundColor = "#171a21"; }}
                        >
                            <div style={{
                                width: "48px", height: "48px", borderRadius: "12px",
                                backgroundColor: "rgba(79,140,255,0.1)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                marginBottom: "16px",
                            }}>
                                <ToolIcon style={{ width: "24px", height: "24px", color: "#4f8cff" }} />
                            </div>
                            <h3 style={{ fontWeight: 600, color: "#e6e8ee", margin: "0 0 8px", fontSize: "16px" }}>{tool.name}</h3>
                            <p style={{ fontSize: "14px", color: "#9aa0aa", lineHeight: 1.6, margin: 0 }}>{tool.description}</p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

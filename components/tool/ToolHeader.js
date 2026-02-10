import Link from "next/link";
import { Shield, ChevronRight } from "lucide-react";

export default function ToolHeader({ title, description, breadcrumbs = [] }) {
    return (
        <div style={{ marginBottom: "32px" }}>
            {breadcrumbs.length > 0 && (
                <nav style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", marginBottom: "16px" }}>
                    <Link href="/" style={{ color: "#6b7280", textDecoration: "none" }}>Home</Link>
                    {breadcrumbs.map((crumb, i) => (
                        <span key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <ChevronRight style={{ width: "14px", height: "14px", color: "#4b5563" }} />
                            {crumb.href ? (
                                <Link href={crumb.href} style={{ color: "#6b7280", textDecoration: "none" }}>{crumb.label}</Link>
                            ) : (
                                <span style={{ color: "#4f8cff" }}>{crumb.label}</span>
                            )}
                        </span>
                    ))}
                </nav>
            )}
            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#e6e8ee", margin: "0 0 8px" }}>{title}</h1>
            <p style={{ fontSize: "15px", color: "#9aa0aa", margin: "0 0 12px", lineHeight: 1.6 }}>{description}</p>
            <p style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#34d399", margin: 0 }}>
                <Shield style={{ width: "14px", height: "14px" }} />
                Files are processed locally. Nothing leaves your browser.
            </p>
        </div>
    );
}

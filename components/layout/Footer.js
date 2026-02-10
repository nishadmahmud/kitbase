import Link from "next/link";
import { LayoutGrid, Shield } from "lucide-react";

export default function Footer() {
    return (
        <footer style={{ borderTop: "1px solid #2a2f3a", backgroundColor: "#0f1115", marginTop: "auto" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "48px 24px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "32px" }}>
                    <div>
                        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "12px" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", backgroundColor: "#4f8cff", borderRadius: "8px" }}>
                                <LayoutGrid style={{ width: "16px", height: "16px", color: "white" }} />
                            </div>
                            <span style={{ fontSize: "18px", fontWeight: 700, color: "#e6e8ee" }}>Kitbase</span>
                        </Link>
                        <p style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "#9aa0aa", margin: 0 }}>
                            <Shield style={{ width: "14px", height: "14px", color: "#34d399" }} />
                            Privacy-first. Files stay on your device.
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: "64px" }}>
                        <div>
                            <h4 style={{ fontSize: "11px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px", marginTop: 0 }}>Platform</h4>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                                <li><Link href="/about" style={{ fontSize: "14px", color: "#9aa0aa", textDecoration: "none" }}>About</Link></li>
                                <li><Link href="/all-tools" style={{ fontSize: "14px", color: "#9aa0aa", textDecoration: "none" }}>All Tools</Link></li>
                                <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: "14px", color: "#9aa0aa", textDecoration: "none" }}>GitHub</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 style={{ fontSize: "11px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px", marginTop: 0 }}>Legal</h4>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                                <li><Link href="/about" style={{ fontSize: "14px", color: "#9aa0aa", textDecoration: "none" }}>Privacy</Link></li>
                                <li><Link href="/about" style={{ fontSize: "14px", color: "#9aa0aa", textDecoration: "none" }}>Terms</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: "40px", paddingTop: "24px", borderTop: "1px solid #2a2f3a", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                    <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>© 2025 Kitbase. Open source productivity.</p>
                    <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>v1.0.0 · Status: Operational</p>
                </div>
            </div>
        </footer>
    );
}

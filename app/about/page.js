import { Shield, Zap, Lock, Code2 } from "lucide-react";

export default function AboutPage() {
    const principles = [
        { icon: Shield, title: "Privacy First", description: "All processing happens in your browser. Your files never leave your device — zero server uploads, zero tracking." },
        { icon: Zap, title: "Blazing Fast", description: "No waiting for server responses. Everything runs client-side with near-instant results." },
        { icon: Lock, title: "No Accounts Needed", description: "Jump right in. No sign-up, no login, no paywalls — just tools that work." },
        { icon: Code2, title: "Open Source", description: "Kitbase is built in the open. Inspect the code, contribute features, or fork it for your own use." },
    ];

    const techs = ["Next.js 16", "React 19", "Tailwind CSS v4", "pdf-lib", "Markdown-it", "Canvas API", "Lucide Icons"];

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "48px 24px" }}>
            <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center", marginBottom: "64px" }}>
                <h1 style={{ fontSize: "36px", fontWeight: 800, color: "#e6e8ee", margin: 0 }}>
                    About <span style={{ color: "#4f8cff" }}>Kitbase</span>
                </h1>
                <p style={{ marginTop: "16px", marginBottom: 0, fontSize: "18px", color: "#9aa0aa", lineHeight: 1.7 }}>
                    A free, privacy-first toolkit that runs entirely in your browser. No uploads, no servers, no BS.
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px", marginBottom: "64px" }}>
                {principles.map((p, i) => {
                    const Icon = p.icon;
                    return (
                        <div
                            key={i}
                            style={{
                                backgroundColor: "#171a21", border: "1px solid #2a2f3a",
                                borderRadius: "16px", padding: "32px",
                            }}
                        >
                            <div style={{
                                width: "48px", height: "48px", borderRadius: "12px",
                                backgroundColor: "rgba(79,140,255,0.1)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                marginBottom: "20px",
                            }}>
                                <Icon style={{ width: "24px", height: "24px", color: "#4f8cff" }} />
                            </div>
                            <h3 style={{ fontWeight: 600, color: "#e6e8ee", margin: "0 0 8px", fontSize: "16px" }}>{p.title}</h3>
                            <p style={{ fontSize: "14px", color: "#9aa0aa", lineHeight: 1.7, margin: 0 }}>{p.description}</p>
                        </div>
                    );
                })}
            </div>

            <div style={{
                backgroundColor: "#171a21", border: "1px solid #2a2f3a",
                borderRadius: "16px", padding: "36px", textAlign: "center",
            }}>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#e6e8ee", margin: "0 0 24px" }}>Built With</h2>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px" }}>
                    {techs.map((tech) => (
                        <span
                            key={tech}
                            style={{
                                padding: "8px 16px", fontSize: "13px", fontWeight: 500,
                                backgroundColor: "#1a1e27", border: "1px solid #2a2f3a",
                                borderRadius: "10px", color: "#9aa0aa",
                            }}
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

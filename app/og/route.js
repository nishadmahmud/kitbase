import { ImageResponse } from "next/og";

export const runtime = "edge";

// Category color map
const categoryColors = {
    pdf: "#4f8cff",
    image: "#a78bfa",
    dev: "#34d399",
    calculator: "#fbbf24",
    text: "#f472b6",
    design: "#818cf8",
    security: "#ef4444",
    productivity: "#f59e0b",
    file: "#6b7280",
    visualization: "#db2777",
};

// Category label map
const categoryLabels = {
    pdf: "PDF Tools",
    image: "Image Tools",
    dev: "Developer Tools",
    calculator: "Calculators",
    text: "Text Tools",
    design: "Design Tools",
    security: "Security Tools",
    productivity: "Productivity",
    file: "File Tools",
    visualization: "Visualization",
};

export async function GET(request) {
    const { searchParams } = new URL(request.url);

    const name = searchParams.get("name") || "Kitbase Tool";
    const desc = searchParams.get("desc") || "Free online tool — no signup required.";
    const cat = searchParams.get("cat") || "dev";

    const accentColor = categoryColors[cat] || "#6366f1";
    const categoryLabel = categoryLabels[cat] || "Tools";

    // Truncate description if too long
    const shortDesc = desc.length > 110 ? desc.slice(0, 107) + "..." : desc;

    return new ImageResponse(
        <div
            style={{
                width: "1200px",
                height: "630px",
                display: "flex",
                flexDirection: "column",
                background: "#0f1117",
                fontFamily: "system-ui, -apple-system, sans-serif",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Background grid */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Accent glow blob */}
            <div
                style={{
                    position: "absolute",
                    top: "-80px",
                    right: "-80px",
                    width: "400px",
                    height: "400px",
                    borderRadius: "50%",
                    background: accentColor,
                    opacity: 0.12,
                    filter: "blur(80px)",
                }}
            />

            {/* Left accent bar */}
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "6px",
                    background: accentColor,
                }}
            />

            {/* Content */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "60px 80px",
                    flex: 1,
                    position: "relative",
                }}
            >
                {/* Top row: Kitbase + category badge */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "auto" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "10px",
                                background: accentColor,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "20px",
                                fontWeight: "900",
                                color: "#fff",
                            }}
                        >
                            K
                        </div>
                        <span style={{ color: "#ffffff", fontSize: "24px", fontWeight: "700", letterSpacing: "-0.5px" }}>
                            Kitbase
                        </span>
                    </div>

                    {/* Category badge */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "8px 18px",
                            borderRadius: "999px",
                            border: `1.5px solid ${accentColor}`,
                            color: accentColor,
                            fontSize: "16px",
                            fontWeight: "600",
                        }}
                    >
                        {categoryLabel}
                    </div>
                </div>

                {/* Tool name */}
                <div style={{ marginBottom: "24px", marginTop: "60px" }}>
                    <div
                        style={{
                            fontSize: "72px",
                            fontWeight: "800",
                            color: "#ffffff",
                            letterSpacing: "-2px",
                            lineHeight: 1.1,
                        }}
                    >
                        {name}
                    </div>
                </div>

                {/* Description */}
                <div
                    style={{
                        fontSize: "26px",
                        color: "#9ca3af",
                        lineHeight: 1.5,
                        fontWeight: "400",
                        maxWidth: "800px",
                    }}
                >
                    {shortDesc}
                </div>

                {/* Bottom row */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "24px",
                        marginTop: "auto",
                        paddingTop: "40px",
                    }}
                >
                    {["Free", "No Signup", "Browser-based", "Private"].map((tag) => (
                        <div
                            key={tag}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                color: "#6b7280",
                                fontSize: "16px",
                                fontWeight: "500",
                            }}
                        >
                            <div
                                style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    background: accentColor,
                                }}
                            />
                            {tag}
                        </div>
                    ))}

                    <div style={{ marginLeft: "auto", color: "#4b5563", fontSize: "18px", fontWeight: "500" }}>
                        kitbase.tech
                    </div>
                </div>
            </div>
        </div>,
        {
            width: 1200,
            height: 630,
        }
    );
}

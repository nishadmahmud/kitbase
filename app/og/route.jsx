import { ImageResponse } from "next/og";

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

const tags = ["Free", "No Signup", "Browser-based", "Private"];

export async function GET(request) {
    const { searchParams } = new URL(request.url);

    const name = searchParams.get("name") || "Kitbase Tool";
    const desc = searchParams.get("desc") || "Free online tool — no signup required.";
    const cat = searchParams.get("cat") || "dev";

    const accentColor = categoryColors[cat] || "#6366f1";
    const categoryLabel = categoryLabels[cat] || "Tools";
    const shortDesc = desc.length > 110 ? desc.slice(0, 107) + "..." : desc;

    // Grid cell size
    const gridSize = 40;
    // Build horizontal grid lines
    const hLines = [];
    for (let y = 0; y <= 630; y += gridSize) {
        hLines.push(
            <div
                key={`h${y}`}
                style={{
                    position: "absolute",
                    top: `${y}px`,
                    left: "0px",
                    width: "1200px",
                    height: "1px",
                    backgroundColor: "#e5e7eb",
                }}
            />
        );
    }
    // Build vertical grid lines
    const vLines = [];
    for (let x = 0; x <= 1200; x += gridSize) {
        vLines.push(
            <div
                key={`v${x}`}
                style={{
                    position: "absolute",
                    left: `${x}px`,
                    top: "0px",
                    width: "1px",
                    height: "630px",
                    backgroundColor: "#e5e7eb",
                }}
            />
        );
    }

    return new ImageResponse(
        <div
            style={{
                width: "1200px",
                height: "630px",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#ffffff",
                fontFamily: "sans-serif",
                position: "relative",
            }}
        >
            {/* Grid lines */}
            {hLines}
            {vLines}

            {/* Accent color glow circle top-right */}
            <div
                style={{
                    position: "absolute",
                    top: "-100px",
                    right: "-100px",
                    width: "360px",
                    height: "360px",
                    borderRadius: "180px",
                    backgroundColor: accentColor,
                    opacity: 0.15,
                }}
            />

            {/* Left accent bar */}
            <div
                style={{
                    position: "absolute",
                    left: "0px",
                    top: "0px",
                    width: "6px",
                    height: "630px",
                    backgroundColor: accentColor,
                }}
            />

            {/* Main content */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "56px 80px 56px 86px",
                    height: "100%",
                    position: "relative",
                }}
            >
                {/* Header row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    {/* Logo */}
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <div
                            style={{
                                width: "42px",
                                height: "42px",
                                borderRadius: "10px",
                                backgroundColor: accentColor,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "22px",
                                fontWeight: "900",
                                color: "#fff",
                            }}
                        >
                            K
                        </div>
                        <span style={{ color: "#111827", fontSize: "26px", fontWeight: "700" }}>
                            Kitbase
                        </span>
                    </div>

                    {/* Category badge */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "8px 20px",
                            borderRadius: "999px",
                            border: `2px solid ${accentColor}`,
                            color: accentColor,
                            fontSize: "18px",
                            fontWeight: "600",
                            backgroundColor: "#fff",
                        }}
                    >
                        {categoryLabel}
                    </div>
                </div>

                {/* Spacer */}
                <div style={{ height: "60px" }} />

                {/* Tool name */}
                <div
                    style={{
                        fontSize: "76px",
                        fontWeight: "800",
                        color: "#111827",
                        letterSpacing: "-2px",
                        lineHeight: "1.1",
                        marginBottom: "24px",
                    }}
                >
                    {name}
                </div>

                {/* Description */}
                <div
                    style={{
                        fontSize: "26px",
                        color: "#6b7280",
                        lineHeight: "1.5",
                        fontWeight: "400",
                        maxWidth: "860px",
                    }}
                >
                    {shortDesc}
                </div>

                {/* Push tags to bottom */}
                <div style={{ flexGrow: 1 }} />

                {/* Tag row */}
                <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
                    {tags.map((tag) => (
                        <div
                            key={tag}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                color: "#6b7280",
                                fontSize: "18px",
                                fontWeight: "500",
                            }}
                        >
                            <div
                                style={{
                                    width: "7px",
                                    height: "7px",
                                    borderRadius: "4px",
                                    backgroundColor: accentColor,
                                }}
                            />
                            {tag}
                        </div>
                    ))}
                    <div style={{ color: "#9ca3af", fontSize: "20px", fontWeight: "500", marginLeft: "auto" }}>
                        kitbase.tech
                    </div>
                </div>
            </div>
        </div>,
        { width: 1200, height: 630 }
    );
}

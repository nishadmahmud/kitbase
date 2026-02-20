import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const gridSize = 40;

// Pre-calculate grid lines
const hLinePositions = [];
for (let y = 0; y <= 630; y += gridSize) hLinePositions.push(y);

const vLinePositions = [];
for (let x = 0; x <= 1200; x += gridSize) vLinePositions.push(x);

// Category pills to show at the bottom
const categories = [
    { label: "PDF Tools", color: "#4f8cff" },
    { label: "Image Tools", color: "#a78bfa" },
    { label: "Developer Tools", color: "#34d399" },
    { label: "Security", color: "#ef4444" },
    { label: "Calculators", color: "#fbbf24" },
    { label: "Productivity", color: "#f59e0b" },
];

export default function Image() {
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
            {/* Grid — horizontal lines */}
            {hLinePositions.map((y) => (
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
            ))}
            {/* Grid — vertical lines */}
            {vLinePositions.map((x) => (
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
            ))}

            {/* Soft blue glow circle — top right */}
            <div
                style={{
                    position: "absolute",
                    top: "-120px",
                    right: "-120px",
                    width: "400px",
                    height: "400px",
                    borderRadius: "200px",
                    backgroundColor: "#6366f1",
                    opacity: 0.1,
                }}
            />

            {/* Soft purple glow circle — bottom left */}
            <div
                style={{
                    position: "absolute",
                    bottom: "-120px",
                    left: "-80px",
                    width: "320px",
                    height: "320px",
                    borderRadius: "160px",
                    backgroundColor: "#a78bfa",
                    opacity: 0.1,
                }}
            />

            {/* Main centered content */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    position: "relative",
                    paddingBottom: "40px",
                }}
            >
                {/* Logo row */}
                <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px" }}>
                    {/* K box */}
                    <div
                        style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "20px",
                            backgroundColor: "#6366f1",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "44px",
                            fontWeight: "900",
                            color: "#ffffff",
                        }}
                    >
                        K
                    </div>
                    {/* Wordmark */}
                    <span
                        style={{
                            fontSize: "88px",
                            fontWeight: "800",
                            color: "#111827",
                            letterSpacing: "-3px",
                            lineHeight: "1",
                        }}
                    >
                        Kitbase
                    </span>
                </div>

                {/* Tagline */}
                <div
                    style={{
                        fontSize: "30px",
                        color: "#6b7280",
                        fontWeight: "400",
                        letterSpacing: "0px",
                        marginBottom: "52px",
                    }}
                >
                    All Your Everyday Tools. One Clean Place.
                </div>

                {/* Category pills row */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "nowrap" }}>
                    {categories.map((cat) => (
                        <div
                            key={cat.label}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 18px",
                                borderRadius: "999px",
                                border: `2px solid ${cat.color}`,
                                color: cat.color,
                                fontSize: "16px",
                                fontWeight: "600",
                                backgroundColor: "#fff",
                            }}
                        >
                            <div
                                style={{
                                    width: "8px",
                                    height: "8px",
                                    borderRadius: "4px",
                                    backgroundColor: cat.color,
                                }}
                            />
                            {cat.label}
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom domain label */}
            <div
                style={{
                    position: "absolute",
                    bottom: "24px",
                    right: "40px",
                    color: "#d1d5db",
                    fontSize: "18px",
                    fontWeight: "500",
                }}
            >
                kitbase.tech
            </div>
        </div>,
        { width: 1200, height: 630 }
    );
}

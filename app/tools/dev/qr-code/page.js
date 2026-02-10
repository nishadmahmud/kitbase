"use client";

import { useState, useRef } from "react";
import { Download, Share2, Settings, Type, Link as LinkIcon, Wifi, Mail } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolActions, { ActionButton } from "@/components/tool/ToolActions";

const TABS = [
    { id: "text", label: "Text", icon: Type },
    { id: "url", label: "URL", icon: LinkIcon },
    { id: "wifi", label: "Wi-Fi", icon: Wifi },
    { id: "email", label: "Email", icon: Mail },
];

export default function QrCodePage() {
    const [activeTab, setActiveTab] = useState("url");
    const [content, setContent] = useState("https://kitbase.com");

    // Custom inputs for specific tabs
    const [wifiSsid, setWifiSsid] = useState("");
    const [wifiPassword, setWifiPassword] = useState("");
    const [wifiEncryption, setWifiEncryption] = useState("WPA");

    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");

    // Style settings
    const [size, setSize] = useState(256);
    const [fgColor, setFgColor] = useState("#000000");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [level, setLevel] = useState("M"); // L, M, Q, H
    const [includeMargin, setIncludeMargin] = useState(true);

    const canvasRef = useRef(null);

    const getQrValue = () => {
        switch (activeTab) {
            case "url":
            case "text":
                return content;
            case "wifi":
                return `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};;`;
            case "email":
                return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            default:
                return content;
        }
    };

    const downloadQr = () => {
        const canvas = document.getElementById("qr-canvas");
        if (canvas) {
            const pngUrl = canvas.toDataURL("image/png");
            const a = document.createElement("a");
            a.href = pngUrl;
            a.download = "qrcode.png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
            <ToolHeader
                title="QR Code Generator"
                description="Create customized QR codes for links, text, Wi-Fi access, and more."
                breadcrumbs={[{ label: "Dev Tools", href: "/category/dev" }, { label: "QR Generator" }]}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "32px", alignItems: "start" }}>
                {/* Left: Controls */}
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    {/* Tabs */}
                    <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    display: "flex", alignItems: "center", gap: "8px",
                                    padding: "10px 16px", borderRadius: "8px", border: "1px solid",
                                    borderColor: activeTab === tab.id ? "#4f8cff" : "#2a2f3a",
                                    backgroundColor: activeTab === tab.id ? "rgba(79, 140, 255, 0.1)" : "#171a21",
                                    color: activeTab === tab.id ? "#4f8cff" : "#9aa0aa",
                                    cursor: "pointer", fontSize: "14px", fontWeight: 600, whiteSpace: "nowrap"
                                }}
                            >
                                <tab.icon size={16} /> {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div style={{ backgroundColor: "#171a21", border: "1px solid #2a2f3a", borderRadius: "16px", padding: "24px" }}>
                        {activeTab === "url" && (
                            <div>
                                <label style={{ display: "block", fontSize: "14px", color: "#e6e8ee", marginBottom: "8px" }}>Website URL</label>
                                <input
                                    type="url"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="https://example.com"
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #3f4451", backgroundColor: "#0f1115", color: "#e6e8ee", outline: "none" }}
                                />
                            </div>
                        )}
                        {activeTab === "text" && (
                            <div>
                                <label style={{ display: "block", fontSize: "14px", color: "#e6e8ee", marginBottom: "8px" }}>Text Content</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Enter text to encode..."
                                    rows={4}
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #3f4451", backgroundColor: "#0f1115", color: "#e6e8ee", outline: "none", resize: "vertical" }}
                                />
                            </div>
                        )}
                        {activeTab === "wifi" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "14px", color: "#e6e8ee", marginBottom: "8px" }}>Network Name (SSID)</label>
                                    <input
                                        type="text"
                                        value={wifiSsid}
                                        onChange={(e) => setWifiSsid(e.target.value)}
                                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #3f4451", backgroundColor: "#0f1115", color: "#e6e8ee", outline: "none" }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "14px", color: "#e6e8ee", marginBottom: "8px" }}>Password</label>
                                    <input
                                        type="text"
                                        value={wifiPassword}
                                        onChange={(e) => setWifiPassword(e.target.value)}
                                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #3f4451", backgroundColor: "#0f1115", color: "#e6e8ee", outline: "none" }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "14px", color: "#e6e8ee", marginBottom: "8px" }}>Encryption</label>
                                    <select
                                        value={wifiEncryption}
                                        onChange={(e) => setWifiEncryption(e.target.value)}
                                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #3f4451", backgroundColor: "#0f1115", color: "#e6e8ee", outline: "none" }}
                                    >
                                        <option value="WPA">WPA/WPA2</option>
                                        <option value="WEP">WEP</option>
                                        <option value="nopass">None</option>
                                    </select>
                                </div>
                            </div>
                        )}
                        {activeTab === "email" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "14px", color: "#e6e8ee", marginBottom: "8px" }}>Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #3f4451", backgroundColor: "#0f1115", color: "#e6e8ee", outline: "none" }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "14px", color: "#e6e8ee", marginBottom: "8px" }}>Subject</label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #3f4451", backgroundColor: "#0f1115", color: "#e6e8ee", outline: "none" }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "14px", color: "#e6e8ee", marginBottom: "8px" }}>Body</label>
                                    <textarea
                                        value={body}
                                        onChange={(e) => setBody(e.target.value)}
                                        rows={3}
                                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #3f4451", backgroundColor: "#0f1115", color: "#e6e8ee", outline: "none", resize: "vertical" }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Customization Options */}
                    <div style={{ backgroundColor: "#171a21", border: "1px solid #2a2f3a", borderRadius: "16px", padding: "24px" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#9aa0aa", textTransform: "uppercase", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <Settings size={16} /> Appearance
                        </h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "14px", color: "#e6e8ee", marginBottom: "8px" }}>Foreground Color</label>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} style={{ width: "32px", height: "32px", padding: 0, border: "none", borderRadius: "4px", cursor: "pointer" }} />
                                    <span style={{ fontSize: "12px", color: "#9aa0aa" }}>{fgColor}</span>
                                </div>
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "14px", color: "#e6e8ee", marginBottom: "8px" }}>Background Color</label>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ width: "32px", height: "32px", padding: 0, border: "none", borderRadius: "4px", cursor: "pointer" }} />
                                    <span style={{ fontSize: "12px", color: "#9aa0aa" }}>{bgColor}</span>
                                </div>
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "14px", color: "#e6e8ee", marginBottom: "8px" }}>Error Correction</label>
                                <select value={level} onChange={(e) => setLevel(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #3f4451", backgroundColor: "#0f1115", color: "#e6e8ee", outline: "none" }}>
                                    <option value="L">Low (7%)</option>
                                    <option value="M">Medium (15%)</option>
                                    <option value="Q">Quartile (25%)</option>
                                    <option value="H">High (30%)</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "14px", color: "#e6e8ee", marginBottom: "8px" }}>Size (px)</label>
                                <input type="number" value={size} onChange={(e) => setSize(Number(e.target.value))} min={128} max={1024} step={32} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #3f4451", backgroundColor: "#0f1115", color: "#e6e8ee", outline: "none" }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Preview */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "sticky", top: "24px" }}>
                    <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "32px", display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid #2a2f3a", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
                        <QRCodeCanvas
                            id="qr-canvas"
                            value={getQrValue()}
                            size={size}
                            fgColor={fgColor}
                            bgColor={bgColor}
                            level={level}
                            includeMargin={includeMargin}
                            style={{ maxWidth: "100%", height: "auto" }}
                        />
                    </div>

                    <ActionButton onClick={downloadQr} icon={Download} fullWidth>
                        Download PNG
                    </ActionButton>
                </div>
            </div>
        </div>
    );
}

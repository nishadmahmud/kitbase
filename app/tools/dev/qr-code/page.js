"use client";

import { useState, useRef } from "react";
import { Download, Settings, Type, Link as LinkIcon, Wifi, Mail } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import ToolHeader from "@/components/tool/ToolHeader";
import { ActionButton } from "@/components/tool/ToolActions";

const TABS = [
    { id: "text", label: "Text", icon: Type },
    { id: "url", label: "URL", icon: LinkIcon },
    { id: "wifi", label: "Wi-Fi", icon: Wifi },
    { id: "email", label: "Email", icon: Mail },
];

export default function QrCodePage() {
    const [activeTab, setActiveTab] = useState("url");
    const [content, setContent] = useState("https://kitbase.com");

    const [wifiSsid, setWifiSsid] = useState("");
    const [wifiPassword, setWifiPassword] = useState("");
    const [wifiEncryption, setWifiEncryption] = useState("WPA");

    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");

    const [size, setSize] = useState(256);
    const [fgColor, setFgColor] = useState("#000000");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [level, setLevel] = useState("M");
    const [includeMargin, setIncludeMargin] = useState(true);

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
        <div className="max-w-[1280px] mx-auto px-6 py-10">
            <ToolHeader
                title="QR Code Generator"
                description="Create customized QR codes for links, text, Wi-Fi access, and more."
                breadcrumbs={[{ label: "Dev Tools", href: "/category/dev" }, { label: "QR Generator" }]}
            />

            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 min-w-0 w-full flex flex-col gap-6">
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${activeTab === tab.id
                                    ? "border-blue-500 bg-blue-500/10 text-blue-500"
                                    : "border-gray-800 bg-[#171a21] text-gray-400 hover:text-gray-200"
                                    }`}
                            >
                                <tab.icon size={16} /> {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="bg-[#171a21] border border-gray-800 rounded-2xl p-6">
                        {activeTab === "url" && (
                            <div>
                                <label className="block text-sm text-gray-200 mb-2 font-medium">Website URL</label>
                                <input
                                    type="url"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="https://example.com"
                                    className="w-full p-3 rounded-lg border border-gray-700 bg-[#1a1e27] text-gray-200 outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                        )}
                        {activeTab === "text" && (
                            <div>
                                <label className="block text-sm text-gray-200 mb-2 font-medium">Text Content</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Enter text to encode..."
                                    rows={4}
                                    className="w-full p-3 rounded-lg border border-gray-700 bg-[#1a1e27] text-gray-200 outline-none focus:border-blue-500 transition-colors resize-y"
                                />
                            </div>
                        )}
                        {activeTab === "wifi" && (
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm text-gray-200 mb-2 font-medium">Network Name (SSID)</label>
                                    <input
                                        type="text"
                                        value={wifiSsid}
                                        onChange={(e) => setWifiSsid(e.target.value)}
                                        className="w-full p-3 rounded-lg border border-gray-700 bg-[#1a1e27] text-gray-200 outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-200 mb-2 font-medium">Password</label>
                                    <input
                                        type="text"
                                        value={wifiPassword}
                                        onChange={(e) => setWifiPassword(e.target.value)}
                                        className="w-full p-3 rounded-lg border border-gray-700 bg-[#1a1e27] text-gray-200 outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-200 mb-2 font-medium">Encryption</label>
                                    <select
                                        value={wifiEncryption}
                                        onChange={(e) => setWifiEncryption(e.target.value)}
                                        className="w-full p-3 rounded-lg border border-gray-700 bg-[#1a1e27] text-gray-200 outline-none focus:border-blue-500 transition-colors"
                                    >
                                        <option value="WPA">WPA/WPA2</option>
                                        <option value="WEP">WEP</option>
                                        <option value="nopass">None</option>
                                    </select>
                                </div>
                            </div>
                        )}
                        {activeTab === "email" && (
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm text-gray-200 mb-2 font-medium">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-3 rounded-lg border border-gray-700 bg-[#1a1e27] text-gray-200 outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-200 mb-2 font-medium">Subject</label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="w-full p-3 rounded-lg border border-gray-700 bg-[#1a1e27] text-gray-200 outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-200 mb-2 font-medium">Body</label>
                                    <textarea
                                        value={body}
                                        onChange={(e) => setBody(e.target.value)}
                                        rows={3}
                                        className="w-full p-3 rounded-lg border border-gray-700 bg-[#1a1e27] text-gray-200 outline-none focus:border-blue-500 transition-colors resize-y"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-[#171a21] border border-gray-800 rounded-2xl p-6">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4 flex items-center gap-2 m-0">
                            <Settings size={16} /> Appearance
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-gray-200 mb-2 font-medium">Foreground Color</label>
                                <div className="flex items-center gap-2">
                                    <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-8 h-8 p-0 border-none rounded cursor-pointer bg-transparent" />
                                    <span className="text-xs text-gray-400 uppercase">{fgColor}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-200 mb-2 font-medium">Background Color</label>
                                <div className="flex items-center gap-2">
                                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 p-0 border-none rounded cursor-pointer bg-transparent" />
                                    <span className="text-xs text-gray-400 uppercase">{bgColor}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-200 mb-2 font-medium">Error Correction</label>
                                <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-700 bg-[#1a1e27] text-gray-200 outline-none focus:border-blue-500 transition-colors">
                                    <option value="L">Low (7%)</option>
                                    <option value="M">Medium (15%)</option>
                                    <option value="Q">Quartile (25%)</option>
                                    <option value="H">High (30%)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-200 mb-2 font-medium">Size (px)</label>
                                <input type="number" value={size} onChange={(e) => setSize(Number(e.target.value))} min={128} max={1024} step={32} className="w-full p-2.5 rounded-lg border border-gray-700 bg-[#1a1e27] text-gray-200 outline-none focus:border-blue-500 transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-[350px] flex-shrink-0 flex flex-col gap-4 sticky top-6">
                    <div className="bg-white rounded-2xl p-8 flex justify-center items-center border border-gray-800 shadow-xl min-h-[300px]">
                        <QRCodeCanvas
                            id="qr-canvas"
                            value={getQrValue()}
                            size={size}
                            fgColor={fgColor}
                            bgColor={bgColor}
                            level={level}
                            includeMargin={includeMargin}
                            className="max-w-full h-auto"
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

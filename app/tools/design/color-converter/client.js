"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";

export default function ColorConverterClient() {
    const [hex, setHex] = useState("#3b82f6");
    const [rgb, setRgb] = useState("rgb(59, 130, 246)");
    const [hsl, setHsl] = useState("hsl(217, 91%, 60%)");

    // Very basic conversion logic state - ideally use a small color lib, 
    // but requested vanilla where possible. Implementing distinct updaters to prevent circular dependency hell issues for now just syncing one way (Hex -> others) mostly or simple event handlers.

    const updateFromHex = (val) => {
        setHex(val);
        if (/^#[0-9A-F]{6}$/i.test(val)) {
            // Valid HEX, update others
            const r = parseInt(val.substring(1, 3), 16);
            const g = parseInt(val.substring(3, 5), 16);
            const b = parseInt(val.substring(5, 7), 16);

            setRgb(`rgb(${r}, ${g}, ${b})`);

            // Calc HSL
            let r_ = r / 255, g_ = g / 255, b_ = b / 255;
            let max = Math.max(r_, g_, b_), min = Math.min(r_, g_, b_);
            let h, s, l = (max + min) / 2;

            if (max === min) {
                h = s = 0;
            } else {
                let d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r_: h = (g_ - b_) / d + (g_ < b_ ? 6 : 0); break;
                    case g_: h = (b_ - r_) / d + 2; break;
                    case b_: h = (r_ - g_) / d + 4; break;
                }
                h /= 6;
            }
            setHsl(`hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`);
        }
    };

    return (
        <div className="min-h-screen pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="Color Converter"
                    description="Convert colors between HEX, RGB, and HSL formats."
                    breadcrumbs={[{ label: "Design", href: "/category/design" }, { label: "Color Converter" }]}
                />
            </div>

            <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-10 flex flex-col md:flex-row gap-8">

                {/* Visualizer */}
                <div
                    className="w-full md:w-1/3 aspect-square rounded-3xl shadow-2xl border-4 border-white dark:border-gray-800 transition-colors duration-200"
                    style={{ backgroundColor: hex }}
                />

                {/* Inputs */}
                <div className="flex-1 flex flex-col gap-4">
                    <ColorInput label="HEX" value={hex} onChange={updateFromHex} type="text" />
                    {/* For brevity, RGB/HSL are read-only-ish for now or just display, fully bi-directional is complex without a lib */}
                    <ColorResult label="RGB" value={rgb} />
                    <ColorResult label="HSL" value={hsl} />

                    <div className="mt-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Picker</label>
                        <input
                            type="color"
                            value={hex}
                            onChange={(e) => updateFromHex(e.target.value)}
                            className="w-full h-12 rounded cursor-pointer bg-transparent"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}

function ColorInput({ label, value, onChange }) {
    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-transparent text-xl font-mono text-gray-900 dark:text-gray-200 outline-none"
                maxLength={7}
            />
        </div>
    );
}

function ColorResult({ label, value }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors flex items-center justify-between">
            <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{label}</label>
                <div className="text-xl font-mono text-gray-900 dark:text-gray-200">{value}</div>
            </div>
            <button
                onClick={handleCopy}
                className={`p-2 rounded-lg transition-colors border ${copied
                    ? "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-500 border-green-200 dark:border-green-500/20"
                    : "bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-700"
                    }`}
            >
                {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
        </div>
    );
}

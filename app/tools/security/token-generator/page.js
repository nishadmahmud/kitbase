"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";

export default function TokenGeneratorPage() {
    const [tokens, setTokens] = useState([]);
    const [count, setCount] = useState(5);
    const [type, setType] = useState("uuid"); // uuid, random-alpha, random-hex

    const generate = () => {
        const newTokens = [];
        for (let i = 0; i < count; i++) {
            if (type === "uuid") {
                newTokens.push(crypto.randomUUID());
            } else if (type === "random-alpha") {
                newTokens.push(generateRandomString(32, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"));
            } else if (type === "random-hex") {
                newTokens.push(generateRandomString(32, "0123456789abcdef"));
            }
        }
        setTokens(newTokens);
    };

    const generateRandomString = (length, chars) => {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
    };

    // Initial gen
    useState(() => {
        generate();
    });

    // Update when type changes
    // useEffect(() => generate(), [type, count]); // Causes loop if not careful, better manual or careful effect

    return (
        <div className="min-h-screen bg-gray-950 pb-12">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="Token Generator"
                    description="Generate random UUIDs (v4) and secure authentication tokens."
                />
            </div>

            <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-10 flex flex-col gap-6">

                {/* Control Bar */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-wrap gap-6 items-center shadow-lg">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="bg-gray-950 border border-gray-800 text-gray-200 text-sm rounded-xl px-4 py-2 outline-none focus:border-gray-600"
                        >
                            <option value="uuid">UUID v4</option>
                            <option value="random-alpha">Random Alphanumeric (32 chars)</option>
                            <option value="random-hex">Random Hex (32 chars)</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Count</label>
                        <input
                            type="number"
                            min="1"
                            max="50"
                            value={count}
                            onChange={(e) => setCount(Number(e.target.value))}
                            className="w-20 bg-gray-950 border border-gray-800 text-gray-200 text-sm rounded-xl px-4 py-2 outline-none focus:border-gray-600"
                        />
                    </div>

                    <div className="flex-1 flex justify-end">
                        <button
                            onClick={generate}
                            className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700 transition-all"
                        >
                            <RefreshCw size={18} /> Regenerate
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="grid gap-3">
                    {tokens.map((token, i) => (
                        <TokenRow key={i} value={token} onCopy={() => handleCopy(token)} />
                    ))}
                </div>

            </div>
        </div>
    );
}

function TokenRow({ value, onCopy }) {
    const [copied, setCopied] = useState(false);

    const click = () => {
        onCopy();
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between shadow-sm group hover:border-gray-600 transition-colors">
            <span className="font-mono text-gray-300 break-all">{value}</span>
            <button
                onClick={click}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border flex-shrink-0 ml-4 ${copied
                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                    : "bg-gray-950 text-gray-400 border-gray-800 hover:text-gray-200 hover:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    }`}
            >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy"}
            </button>
        </div>
    );
}

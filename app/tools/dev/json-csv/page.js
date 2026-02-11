"use client";

import { useState } from "react";
import { Copy, Check, RotateCcw, ArrowRightLeft, ArrowLeftRight } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";

export default function JsonCsvConverterPage() {
    const [json, setJson] = useState("");
    const [csv, setCsv] = useState("");
    const [error, setError] = useState("");
    const [copiedJson, setCopiedJson] = useState(false);
    const [copiedCsv, setCopiedCsv] = useState(false);

    const jsonToCsv = () => {
        try {
            setError("");
            const data = JSON.parse(json);
            if (!Array.isArray(data)) {
                setError("JSON must be an array of objects.");
                return;
            }
            if (data.length === 0) {
                setCsv("");
                return;
            }
            const headers = Object.keys(data[0]);
            const csvRows = [headers.join(",")];

            for (const row of data) {
                const values = headers.map(header => {
                    const val = row[header];
                    const escaped = ('' + val).replace(/"/g, '\\"');
                    return `"${escaped}"`;
                });
                csvRows.push(values.join(","));
            }
            setCsv(csvRows.join("\n"));
        } catch (e) {
            setError("Invalid JSON format.");
        }
    };

    const csvToJson = () => {
        try {
            setError("");
            const lines = csv.trim().split("\n");
            if (lines.length < 2) {
                setJson("[]");
                return;
            }
            const headers = lines[0].split(",");
            const result = [];

            for (let i = 1; i < lines.length; i++) {
                const obj = {};
                const currentline = lines[i].split(","); // Basic split, doesn't handle commas inside quotes well without complex regex

                for (let j = 0; j < headers.length; j++) {
                    let val = currentline[j];
                    if (val && val.startsWith('"') && val.endsWith('"')) {
                        val = val.substring(1, val.length - 1).replace(/\\"/g, '"');
                    }
                    obj[headers[j]] = val;
                }
                result.push(obj);
            }
            setJson(JSON.stringify(result, null, 2));
        } catch (e) {
            setError("Error parsing CSV.");
        }
    };

    const handleCopy = (text, setCopied) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="JSON <> CSV Converter"
                    description="Convert data between JSON and CSV formats instantly."
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10 flex flex-col gap-6">

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-500 px-4 py-3 rounded-xl text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    {/* JSON Area */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden flex flex-col h-[500px] shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                        <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 flex justify-between items-center transition-colors">
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider">JSON</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setJson("")}
                                    className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <RotateCcw size={14} /> Clear
                                </button>
                                <button
                                    onClick={() => handleCopy(json, setCopiedJson)}
                                    disabled={!json}
                                    className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-colors border ${copiedJson
                                        ? "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-500 border-green-200 dark:border-green-500/20"
                                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        }`}
                                >
                                    {copiedJson ? <Check size={14} /> : <Copy size={14} />}
                                    {copiedJson ? "Copied" : "Copy"}
                                </button>
                            </div>
                        </div>
                        <textarea
                            value={json}
                            onChange={(e) => setJson(e.target.value)}
                            placeholder='[{"name": "John", "age": 30}]'
                            className="flex-1 w-full bg-transparent p-5 text-gray-900 dark:text-gray-200 text-xs leading-relaxed outline-none resize-none placeholder:text-gray-400 dark:placeholder:text-gray-700 font-mono"
                            spellCheck={false}
                        />
                    </div>

                    {/* Controls */}
                    {/* CSV Area */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden flex flex-col h-[500px] shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                        <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 flex justify-between items-center transition-colors">
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider">CSV</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCsv("")}
                                    className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <RotateCcw size={14} /> Clear
                                </button>
                                <button
                                    onClick={() => handleCopy(csv, setCopiedCsv)}
                                    disabled={!csv}
                                    className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-colors border ${copiedCsv
                                        ? "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-500 border-green-200 dark:border-green-500/20"
                                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        }`}
                                >
                                    {copiedCsv ? <Check size={14} /> : <Copy size={14} />}
                                    {copiedCsv ? "Copied" : "Copy"}
                                </button>
                            </div>
                        </div>
                        <textarea
                            value={csv}
                            onChange={(e) => setCsv(e.target.value)}
                            placeholder="name,age&#10;John,30"
                            className="flex-1 w-full bg-transparent p-5 text-gray-900 dark:text-gray-200 text-xs leading-relaxed outline-none resize-none placeholder:text-gray-400 dark:placeholder:text-gray-700 font-mono"
                            spellCheck={false}
                        />
                    </div>
                </div>

                {/* Central Controls */}
                <div className="flex justify-center gap-4">
                    <button
                        onClick={jsonToCsv}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:scale-105 transition-all shadow-lg shadow-gray-900/10 dark:shadow-gray-100/10"
                    >
                        JSON <ArrowRightLeft className="w-4 h-4" /> CSV
                    </button>
                    <button
                        onClick={csvToJson}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                    >
                        CSV <ArrowRightLeft className="w-4 h-4" /> JSON
                    </button>
                </div>

            </div>
        </div>
    );
}

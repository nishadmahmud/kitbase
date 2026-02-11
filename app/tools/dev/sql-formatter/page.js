"use client";

import { useState } from "react";
import { Copy, Check, RotateCcw, Database } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";

export default function SqlFormatterPage() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [copied, setCopied] = useState(false);

    const formatSql = () => {
        // Basic SQL formatter logic
        // This is a naive implementation. For production quality, we'd use 'sql-formatter' pkg.
        // But requested to keep deps low for now, so using regex replacers.
        let sql = input
            .replace(/\s+/g, ' ')
            .replace(/SELECT/gi, '\nSELECT')
            .replace(/FROM/gi, '\nFROM')
            .replace(/WHERE/gi, '\nWHERE')
            .replace(/AND/gi, '\n  AND')
            .replace(/OR/gi, '\n  OR')
            .replace(/ORDER BY/gi, '\nORDER BY')
            .replace(/GROUP BY/gi, '\nGROUP BY')
            .replace(/INSERT INTO/gi, '\nINSERT INTO')
            .replace(/VALUES/gi, '\nVALUES')
            .replace(/UPDATE/gi, '\nUPDATE')
            .replace(/SET/gi, '\nSET')
            .replace(/DELETE FROM/gi, '\nDELETE FROM')
            .replace(/JOIN/gi, '\nJOIN')
            .replace(/LEFT JOIN/gi, '\nLEFT JOIN')
            .replace(/RIGHT JOIN/gi, '\nRIGHT JOIN')
            .replace(/INNER JOIN/gi, '\nINNER JOIN')
            .replace(/ON/gi, ' ON')
            .replace(/;/g, ';\n')
            .trim();

        setOutput(sql);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950 pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="SQL Formatter"
                    description="Format and beautify your SQL queries for better readability."
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10 flex flex-col gap-6">

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Input Area */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden flex flex-col h-[500px] shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                        <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 flex justify-between items-center">
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider">Input SQL</span>
                            <button
                                onClick={() => { setInput(""); setOutput(""); }}
                                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <RotateCcw size={14} /> Clear
                            </button>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Paste your SQL Query here..."
                            className="flex-1 w-full bg-transparent p-5 text-gray-900 dark:text-gray-200 text-base leading-relaxed outline-none resize-none placeholder:text-gray-400 dark:placeholder:text-gray-700 font-mono"
                            spellCheck={false}
                        />
                    </div>

                    {/* Output Area */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden flex flex-col h-[500px] shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                        <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 flex justify-between items-center">
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider">Formatted SQL</span>
                            <button
                                onClick={handleCopy}
                                disabled={!output}
                                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-colors border ${copied
                                    ? "bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20"
                                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    }`}
                            >
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                {copied ? "Copied" : "Copy"}
                            </button>
                        </div>
                        <textarea
                            value={output}
                            readOnly
                            placeholder="Result will appear here..."
                            className="flex-1 w-full bg-transparent p-5 text-gray-900 dark:text-gray-200 text-base leading-relaxed outline-none resize-none placeholder:text-gray-400 dark:placeholder:text-gray-700 font-mono"
                        />
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col items-center gap-6 shadow-sm dark:shadow-lg">
                    <button
                        onClick={formatSql}
                        className="flex items-center gap-2 px-8 py-3 rounded-xl text-base font-semibold bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-gray-900/10 dark:shadow-gray-100/10"
                    >
                        <Database size={18} /> Format Query
                    </button>
                    <p className="text-xs text-gray-500">Note: This uses a basic formatter. Complex nested queries might result in imperfect indentation.</p>
                </div>

            </div>
        </div>
    );
}

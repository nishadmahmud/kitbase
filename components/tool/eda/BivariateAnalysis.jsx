"use client";

import { useState, useRef } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from "recharts";

import { Download } from "lucide-react";
import { downloadChartAsPng } from "@/components/tool/visualization/utils";
import CustomSelect from "@/components/ui/CustomSelect";

export default function BivariateAnalysis({ data }) {
    const chartRef = useRef(null);
    if (!data || data.length === 0) return null;

    const columns = Object.keys(data[0]);
    const numericColumns = columns.filter(col => {
        const val = Number(data[0][col]);
        return !isNaN(val) && typeof val === 'number';
    });

    const [xVar, setXVar] = useState(numericColumns[0] || "");
    const [yVar, setYVar] = useState(numericColumns[1] || numericColumns[0] || "");

    // Transform data for Scatter Chart
    const scatterData = data.map((row, i) => ({
        x: Number(row[xVar]),
        y: Number(row[yVar]),
        index: i
    })).filter(pt => !isNaN(pt.x) && !isNaN(pt.y));

    if (numericColumns.length < 2) {
        return <div className="text-gray-500 text-sm">Need at least 2 numeric variables for bivariate analysis.</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">X Axis</label>
                    <CustomSelect
                        value={xVar}
                        onChange={(e) => setXVar(e.target.value)}
                        options={numericColumns.map(col => ({ value: col, label: col }))}
                        className="w-40"
                    />
                </div>

                <div className="text-gray-400">vs</div>

                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Y Axis</label>
                    <CustomSelect
                        value={yVar}
                        onChange={(e) => setYVar(e.target.value)}
                        options={numericColumns.map(col => ({ value: col, label: col }))}
                        className="w-40"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-end">
                    <button
                        onClick={() => downloadChartAsPng(chartRef.current, `bivariate-${xVar}-vs-${yVar}.png`)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <Download size={14} /> Export PNG
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm min-h-[400px]" ref={chartRef}>
                    <ResponsiveContainer width="100%" height={400}>
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                            <XAxis type="number" dataKey="x" name={xVar} className="text-xs text-gray-500">
                                <Label value={xVar} offset={0} position="insideBottom" />
                            </XAxis>
                            <YAxis type="number" dataKey="y" name={yVar} className="text-xs text-gray-500">
                                <Label value={yVar} angle={-90} position="insideLeft" />
                            </YAxis>
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                            <Scatter name={`${xVar} vs ${yVar}`} data={scatterData} fill="#8884d8" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

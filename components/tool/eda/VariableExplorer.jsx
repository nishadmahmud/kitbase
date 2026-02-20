"use client";

import { useState, useMemo, useRef } from "react";
import { BarChart2, Activity, PieChart, LineChart, TrendingUp, Download } from "lucide-react";
import { createHistogramData } from "@/lib/eda/stats";
import ChartRenderer from "@/components/tool/visualization/ChartRenderer"; // Reusing chart renderer


import { downloadChartAsPng } from "@/components/tool/visualization/utils";
import CustomSelect from "@/components/ui/CustomSelect";

export default function VariableExplorer({ data }) {
    const chartRef = useRef(null);
    if (!data || data.length === 0) return null;

    const columns = Object.keys(data[0]);
    // Filter only numeric columns
    const numericColumns = columns.filter(col => {
        const val = Number(data[0][col]);
        return !isNaN(val) && typeof val === 'number';
    });

    const [selectedColumn, setSelectedColumn] = useState(numericColumns[0] || "");
    const [bins, setBins] = useState(10);
    const [viewMode, setViewMode] = useState("histogram"); // "histogram" | "raw"
    const [chartType, setChartType] = useState("bar"); // "bar", "line", "area", "pie"

    const chartData = useMemo(() => {
        if (!selectedColumn) return [];

        if (viewMode === "raw") {
            return data.map((row, i) => ({
                name: i + 1, // Index as name
                value: Number(row[selectedColumn])
            })).filter(item => !isNaN(item.value));
        }

        return createHistogramData(data, selectedColumn, bins);
    }, [data, selectedColumn, bins, viewMode]);

    if (numericColumns.length === 0) {
        return <div className="text-gray-500 text-sm">No numeric variables found.</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 justify-between">
                <div className="flex flex-wrap items-center gap-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Variable</label>
                        <CustomSelect
                            value={selectedColumn}
                            onChange={(e) => setSelectedColumn(e.target.value)}
                            options={numericColumns.map(col => ({ value: col, label: col }))}
                            className="w-full sm:w-48"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Chart Type</label>
                        <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                            {[
                                { id: "bar", icon: BarChart2, label: "Bar" },
                                { id: "line", icon: LineChart, label: "Line" },
                                { id: "area", icon: TrendingUp, label: "Area" },
                                { id: "pie", icon: PieChart, label: "Pie" },
                            ].map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => setChartType(type.id)}
                                    title={type.label}
                                    className={`p-1.5 rounded-md transition-colors ${chartType === type.id
                                        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                                        : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        }`}
                                >
                                    <type.icon size={16} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {viewMode === "histogram" && (
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Bins: {bins}</label>
                            <input
                                type="range"
                                min="5"
                                max="50"
                                value={bins}
                                onChange={(e) => setBins(Number(e.target.value))}
                                className="w-24 accent-indigo-500"
                            />
                        </div>
                    )}
                </div>

                <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setViewMode("histogram")}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${viewMode === "histogram"
                            ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                            : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            }`}
                    >
                        <BarChart2 size={14} /> Histogram
                    </button>
                    <button
                        onClick={() => setViewMode("raw")}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${viewMode === "raw"
                            ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                            : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            }`}
                    >
                        <Activity size={14} /> Raw Data
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-end">
                    <button
                        onClick={() => downloadChartAsPng(chartRef.current, `variable-distribution-${selectedColumn}.png`)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <Download size={14} /> Export PNG
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm" ref={chartRef}>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
                        {viewMode === "histogram" ? `Distribution of ${selectedColumn}` : `Raw Values of ${selectedColumn}`}
                    </h4>
                    <ChartRenderer
                        data={chartData}
                        type={chartType}
                        xKey="name"
                        yKey={viewMode === "histogram" ? "count" : "value"}
                        color="#8884d8"
                    />
                    <div className="mt-2 text-xs text-center text-gray-500">
                        {viewMode === "histogram"
                            ? "X-Axis: Value Ranges | Y-Axis: Frequency"
                            : "X-Axis: Index | Y-Axis: Value"
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

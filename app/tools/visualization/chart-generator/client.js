"use client";

import { useState, useRef, useCallback } from "react";
import { BarChart, Upload, Table, Download, Image as ImageIcon, FileText } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import ChartRenderer from "@/components/tool/visualization/ChartRenderer";
import DataEditor from "@/components/tool/visualization/DataEditor";
import CsvUploader from "@/components/tool/visualization/CsvUploader";
import ChartControls from "@/components/tool/visualization/ChartControls";
import { toPng } from "html-to-image";

const INITIAL_DATA = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 600 },
    { name: "Apr", value: 800 },
    { name: "May", value: 500 },
];

export default function ChartGeneratorClient() {
    const [data, setData] = useState(INITIAL_DATA);
    const [mode, setMode] = useState("manual"); // "manual" | "csv"
    const [chartType, setChartType] = useState("bar");
    const [color, setColor] = useState("#8884d8");
    const [maxY, setMaxY] = useState(null);

    const chartRef = useRef(null);

    const handleDataUpdate = (newData) => {
        setData(newData);
    };

    const handleCsvLoaded = (csvData) => {
        setData(csvData);
        setMode("manual"); // Switch to manual to verify/edit data
    };

    const handleExport = useCallback(async (format) => {
        if (chartRef.current === null) {
            return;
        }

        try {
            const dataUrl = await toPng(chartRef.current, { cacheBust: true, pixelRatio: 3 });
            const link = document.createElement("a");
            link.download = `chart-export-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error("Failed to export image", err);
        }
    }, [chartRef]);

    return (
        <div className="min-h-screen pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="Chart Generator"
                    description="Create beautiful Bar, Line, Area, and Pie charts from CSV files or manual data entry."
                    breadcrumbs={[
                        { label: "Visualization", href: "/category/visualization" },
                        { label: "Chart Generator" },
                    ]}
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10 flex flex-col gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Input & Controls */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Mode Switcher */}
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-1 rounded-xl flex shadow-sm">
                            <button
                                onClick={() => setMode("manual")}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${mode === "manual" ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                            >
                                <Table size={16} /> Manual Data
                            </button>
                            <button
                                onClick={() => setMode("csv")}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${mode === "csv" ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                            >
                                <Upload size={16} /> Upload CSV
                            </button>
                        </div>

                        {/* Input Area */}
                        <div className="h-[400px]">
                            {mode === "manual" ? (
                                <DataEditor data={data} onUpdate={handleDataUpdate} />
                            ) : (
                                <CsvUploader onDataLoaded={handleCsvLoaded} />
                            )}
                        </div>

                        {/* Controls */}
                        <ChartControls
                            type={chartType}
                            setType={setChartType}
                            color={color}
                            setColor={setColor}
                            maxY={maxY}
                            setMaxY={setMaxY}
                        />
                    </div>

                    {/* Right Column: Chart Preview */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <BarChart className="text-indigo-500" /> Chart Preview
                                </h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleExport("png")}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium transition-colors"
                                    >
                                        <Download size={14} /> Export PNG
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl">
                                <ChartRenderer
                                    ref={chartRef}
                                    data={data}
                                    type={chartType}
                                    color={color}
                                    maxY={maxY}
                                />
                            </div>
                        </div>

                        <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-xl p-4 text-sm text-indigo-800 dark:text-indigo-300">
                            <p className="font-semibold mb-1">💡 Tip:</p>
                            <p>Upload a CSV file with &quot;name&quot; and &quot;value&quot; columns to automatically generate a chart. You can then switch to &quot;Manual Data&quot; to fine-tune the values.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

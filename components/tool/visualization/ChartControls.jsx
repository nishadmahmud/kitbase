"use client";

import { BarChart, LineChart, PieChart, Activity, Palette } from "lucide-react";

export default function ChartControls({ type, setType, color, setColor, maxY, setMaxY }) {
    const chartTypes = [
        { id: "bar", label: "Bar", icon: BarChart },
        { id: "line", label: "Line", icon: LineChart },
        { id: "area", label: "Area", icon: Activity },
        { id: "pie", label: "Pie", icon: PieChart },
    ];

    const colors = [
        "#8884d8", // Purple
        "#82ca9d", // Green
        "#ffc658", // Yellow
        "#ff7300", // Orange
        "#0088fe", // Blue
        "#ef4444", // Red
    ];

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm space-y-5">

            {/* Chart Type */}
            <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Chart Type</label>
                <div className="grid grid-cols-4 gap-2">
                    {chartTypes.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setType(t.id)}
                            className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs transition-all ${type === t.id
                                    ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                                }`}
                        >
                            <t.icon size={18} className="mb-1" />
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Max Y Axis */}
            {type !== "pie" && (
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Y-Axis Max Value</label>
                    <input
                        type="number"
                        value={maxY || ""}
                        onChange={(e) => setMaxY(e.target.value ? Number(e.target.value) : null)}
                        placeholder="Auto"
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 transition-colors"
                    />
                </div>
            )}

            {/* Theme Color */}
            <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Theme Color</label>
                <div className="flex flex-wrap gap-2 mb-3">
                    {colors.map((c) => (
                        <button
                            key={c}
                            onClick={() => setColor(c)}
                            className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? 'border-gray-900 dark:border-white ring-1 ring-offset-1 ring-offset-white dark:ring-offset-gray-900 ring-gray-400' : 'border-transparent'}`}
                            style={{ backgroundColor: c }}
                            aria-label={`Select color ${c}`}
                        />
                    ))}
                </div>

                {/* Custom Color Picker */}
                <div className="flex items-center gap-2">
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Palette size={14} />
                        </div>
                        <input
                            type="text"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-full pl-9 pr-2 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-indigo-500 uppercase"
                        />
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="absolute inset-y-1 right-1 w-8 h-8 opacity-0 cursor-pointer"
                        />
                        <div
                            className="absolute inset-y-2 right-2 w-6 h-6 rounded border border-gray-200 dark:border-gray-600 pointer-events-none"
                            style={{ backgroundColor: color }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useRef } from "react";
import { Download } from "lucide-react";
import { downloadChartAsPng } from "@/components/tool/visualization/utils";

export default function StatsSummary({ stats }) {
    const tableRef = useRef(null);
    if (!stats || Object.keys(stats).length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                No numeric data available for statistics.
            </div>
        );
    }

    const variables = Object.keys(stats);

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button
                    onClick={() => downloadChartAsPng(tableRef.current, "descriptive-statistics.png")}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    <Download size={14} /> Export PNG
                </button>
            </div>
            <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg" ref={tableRef}>
                <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-800">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-900/50">
                            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-gray-900 z-10">
                                Measure
                            </th>
                            {variables.map((v) => (
                                <th key={v} className="px-4 py-3 text-right font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                    {v}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                        {[
                            { key: "count", label: "Count" },
                            { key: "mean", label: "Mean", format: (v) => v.toFixed(2) },
                            { key: "median", label: "Median", format: (v) => v.toFixed(2) },
                            { key: "stdDev", label: "Std. Dev", format: (v) => v.toFixed(2) },
                            { key: "min", label: "Min", format: (v) => v.toFixed(2) },
                            { key: "max", label: "Max", format: (v) => v.toFixed(2) },
                            { key: "q1", label: "25% (Q1)", format: (v) => v.toFixed(2) },
                            { key: "q3", label: "75% (Q3)", format: (v) => v.toFixed(2) },
                            { key: "skewness", label: "Skewness", format: (v) => v.toFixed(3) },
                            { key: "kurtosis", label: "Kurtosis", format: (v) => v.toFixed(3) },
                        ].map((row) => (
                            <tr key={row.key} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <td className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-gray-900">
                                    {row.label}
                                </td>
                                {variables.map((v) => (
                                    <td key={v} className="px-4 py-2 text-right text-gray-600 dark:text-gray-400 font-mono">
                                        {stats[v][row.key] !== undefined
                                            ? row.format
                                                ? row.format(stats[v][row.key])
                                                : stats[v][row.key]
                                            : "-"}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

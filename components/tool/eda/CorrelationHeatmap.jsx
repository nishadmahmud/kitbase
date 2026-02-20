"use client";

import { useMemo, useRef, useState } from "react";
import { Download } from "lucide-react";
import { downloadChartAsPng, getHeatmapColor } from "@/components/tool/visualization/utils";
import CustomSelect from "@/components/ui/CustomSelect";

export default function CorrelationHeatmap({ matrixData }) {
    const heatmapRef = useRef(null);
    const { variables, matrix } = matrixData;
    const [theme, setTheme] = useState("RdBu");
    const [showValues, setShowValues] = useState(true);
    const [labelRotation, setLabelRotation] = useState(-90);

    const maxLabelLength = useMemo(() => {
        if (!variables) return 0;
        return Math.max(...variables.map(v => v.length));
    }, [variables]);

    const requiredBottomHeight = useMemo(() => {
        const angle = Math.abs(labelRotation * (Math.PI / 180));
        // Approx standard char width ~7px, height ~14px
        const textWidth = maxLabelLength * 7;
        const textHeight = 14;
        const rotatedHeight = textWidth * Math.sin(angle) + textHeight * Math.cos(angle);
        return Math.max(40, rotatedHeight + 20); // +20 padding
    }, [maxLabelLength, labelRotation]);

    if (!variables || variables.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                No numeric data available for correlation analysis.
            </div>
        );
    }

    // ... options definitions (moved internally or kept) ...

    const themeOptions = [
        { value: "RdBu", label: "Red - Blue (Diverging)" },
        { value: "BrBG", label: "Brown - Teal (Diverging)" },
        { value: "PiYG", label: "Pink - Green (Diverging)" },
        { value: "Viridis", label: "Viridis (Sequential)" },
    ];

    const rotationOptions = [
        { value: -90, label: "-90° (Vertical Up)" },
        { value: -45, label: "-45° (Angled Up)" },
        { value: 0, label: "0° (Horizontal)" },
        { value: 45, label: "45° (Angled Down)" },
        { value: 90, label: "90° (Vertical Down)" },
    ];

    return (
        <div className="space-y-4">
            {/* Header Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                <div className="flex flex-wrap items-center gap-6">
                    <div className="w-40">
                        <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Color Theme</label>
                        <CustomSelect
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            options={themeOptions}
                            className="w-full text-xs"
                        />
                    </div>
                    <div className="w-40">
                        <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Label Rotation</label>
                        <CustomSelect
                            value={labelRotation}
                            onChange={(e) => setLabelRotation(Number(e.target.value))}
                            options={rotationOptions}
                            className="w-full text-xs"
                        />
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showValues}
                                onChange={(e) => setShowValues(e.target.checked)}
                                className="w-3.5 h-3.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Values</span>
                        </label>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={() => downloadChartAsPng(heatmapRef.current, "correlation-matrix.png")}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                    >
                        <Download size={14} /> Export PNG
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex justify-center overflow-auto">
                <div className="flex gap-4 bg-white dark:bg-gray-900 p-4 rounded-lg" ref={heatmapRef}>
                    <div>
                        <table className="border-collapse mx-auto">
                            <tbody>
                                {variables.map((v1, i) => (
                                    <tr key={v1}>
                                        <td className="p-2 text-xs font-semibold text-gray-700 dark:text-gray-300 text-right align-middle whitespace-nowrap">
                                            {v1}
                                        </td>
                                        {variables.map((v2, j) => {
                                            const value = matrix[i][j];
                                            return (
                                                <td
                                                    key={`${v1}-${v2}`}
                                                    className="p-0 border border-white dark:border-gray-900"
                                                    title={`${v1} vs ${v2}: ${value.toFixed(3)}`}
                                                >
                                                    <div
                                                        className="w-16 h-16 flex items-center justify-center text-xs font-mono transition-none"
                                                        style={{
                                                            backgroundColor: getHeatmapColor(value, theme),
                                                            color: Math.abs(value) > 0.5 ? "white" : "black",
                                                        }}
                                                    >
                                                        {showValues && value.toFixed(2)}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                                <tr>
                                    <td className="p-2"></td>
                                    {variables.map((v) => (
                                        <td key={v} className="p-2 align-top relative" style={{ height: `${requiredBottomHeight}px` }}>
                                            <div className="absolute top-2 left-1/2 w-0 h-0">
                                                <div
                                                    className="whitespace-nowrap text-xs font-semibold text-gray-600 dark:text-gray-400"
                                                    style={{
                                                        transform: `rotate(${labelRotation}deg)`,
                                                        transformOrigin: labelRotation < 0 ? "center right" : (labelRotation > 0 ? "center left" : "center"),
                                                        textAlign: labelRotation < 0 ? "right" : (labelRotation > 0 ? "left" : "center"),
                                                        position: 'absolute',
                                                        right: labelRotation < 0 ? '0' : 'auto',
                                                        left: labelRotation > 0 ? '0' : (labelRotation === 0 ? '-50%' : 'auto'),
                                                        marginTop: '10px',
                                                        marginLeft: labelRotation === 0 ? '-20px' : '0px',
                                                    }}
                                                >
                                                    {v}
                                                </div>
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Legend matched to matrix height */}
                    <div className="flex flex-row justify-start min-w-[70px] pl-4" style={{ height: `${variables.length * 64}px` }}>
                        <div className="w-5 relative border border-gray-300 dark:border-gray-700 rounded-full overflow-hidden h-full" style={{
                            background: theme === "Viridis"
                                ? "linear-gradient(to top, #440154, #3b528b, #21918c, #5ec962, #fde725)"
                                : theme === "BrBG"
                                    ? "linear-gradient(to top, rgb(166,97,26), white, rgb(1,133,113))"
                                    : theme === "PiYG"
                                        ? "linear-gradient(to top, rgb(197,27,125), white, rgb(77,146,33))"
                                        : "linear-gradient(to top, rgb(239,68,68), white, rgb(59,130,246))" // Red (Bot) -> Blue (Top)
                        }}></div>
                        <div className="flex flex-col justify-between text-[10px] font-medium text-gray-500 py-0 ml-2 text-left h-full">
                            <span>+1.0</span>
                            <span>+0.5</span>
                            <span>0.0</span>
                            <span>-0.5</span>
                            <span>-1.0</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

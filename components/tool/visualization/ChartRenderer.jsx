"use client";

import {
    BarChart,
    Bar,
    LineChart,
    Line,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { forwardRef } from "react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

const ChartRenderer = forwardRef(({ data, type = "bar", xKey = "name", yKey = "value", color = "#8884d8", maxY }, ref) => {
    if (!data || data.length === 0) {
        return (
            <div className="h-[400px] flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                No data to display
            </div>
        );
    }

    const yDomain = [0, maxY || 'auto'];

    const renderChart = () => {
        switch (type) {
            case "line":
                return (
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                        <XAxis dataKey={xKey} className="text-xs text-gray-500" />
                        <YAxis domain={yDomain} className="text-xs text-gray-500" />
                        <Tooltip
                            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey={yKey} stroke={color} activeDot={{ r: 8 }} strokeWidth={2} />
                    </LineChart>
                );
            case "area":
                return (
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                        <XAxis dataKey={xKey} className="text-xs text-gray-500" />
                        <YAxis domain={yDomain} className="text-xs text-gray-500" />
                        <Tooltip
                            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                        />
                        <Legend />
                        <Area type="monotone" dataKey={yKey} stroke={color} fill={color} fillOpacity={0.3} />
                    </AreaChart>
                );
            case "pie":
                return (
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey={yKey}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? color : COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                        />
                        <Legend />
                    </PieChart>
                );
            case "bar":
            default:
                return (
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                        <XAxis dataKey={xKey} className="text-xs text-gray-500" />
                        <YAxis domain={yDomain} className="text-xs text-gray-500" />
                        <Tooltip
                            cursor={{ fill: "transparent" }}
                            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                        />
                        <Legend />
                        <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} />
                    </BarChart>
                );
        }
    };

    return (
        <div ref={ref} className="w-full h-[400px] bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
            <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
            </ResponsiveContainer>
        </div>
    );
});

ChartRenderer.displayName = "ChartRenderer";

export default ChartRenderer;

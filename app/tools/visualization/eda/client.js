"use client";

import { useState, useMemo } from "react";
import { Upload, Table, Activity, BarChart2, GitCommit, FileText } from "lucide-react"; // Changed BarChart to BarChart2 to avoid conflict with Recharts
import ToolHeader from "@/components/tool/ToolHeader";
import CsvUploader from "@/components/tool/visualization/CsvUploader";
import StatsSummary from "@/components/tool/eda/StatsSummary";
import CorrelationHeatmap from "@/components/tool/eda/CorrelationHeatmap";
import VariableExplorer from "@/components/tool/eda/VariableExplorer";
import BivariateAnalysis from "@/components/tool/eda/BivariateAnalysis";
import { calculateDescriptiveStats, calculateCorrelationMatrix } from "@/lib/eda/stats";

export default function EdaClient() {
    const [data, setData] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [selectedCorrelationVars, setSelectedCorrelationVars] = useState([]);

    const stats = useMemo(() => calculateDescriptiveStats(data), [data]);

    const correlationMatrix = useMemo(() => {
        if (!data || selectedCorrelationVars.length === 0) return { variables: [], matrix: [] };

        // Filter data to only include selected variables
        const filteredData = data.map(row => {
            const newRow = {};
            selectedCorrelationVars.forEach(col => {
                newRow[col] = row[col];
            });
            return newRow;
        });

        return calculateCorrelationMatrix(filteredData);
    }, [data, selectedCorrelationVars]);

    const handleDataLoaded = (loadedData) => {
        setData(loadedData);
        if (loadedData && loadedData.length > 0) {
            // Identify numeric columns for default selection
            const columns = Object.keys(loadedData[0]);
            const numericColumns = columns.filter(col => {
                const val = Number(loadedData[0][col]);
                return !isNaN(val) && typeof val === 'number';
            });
            setSelectedCorrelationVars(numericColumns);
        }
    };

    const tabs = [
        { id: "overview", label: "Overview", icon: Table },
        { id: "distributions", label: "Distributions", icon: BarChart2 },
        { id: "correlations", label: "Correlations", icon: Activity },
        { id: "relationships", label: "Relationships", icon: GitCommit },
    ];

    return (
        <div className="min-h-screen pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="EDA Workspace"
                    description="Perform exploratory data analysis with descriptive statistics, correlation matrices, and advanced plots."
                    breadcrumbs={[
                        { label: "Visualization", href: "/category/visualization" },
                        { label: "EDA Workspace" },
                    ]}
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10 space-y-8">
                {!data ? (
                    <div className="max-w-xl mx-auto mt-12">
                        <CsvUploader onDataLoaded={handleDataLoaded} />
                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-500 mb-2">Don&apos;t have a file?</p>
                            <button
                                onClick={() => {
                                    // Load sample Iris-like dataset
                                    const sampleData = Array.from({ length: 50 }, (_, i) => ({
                                        sepalLength: 4 + Math.random() * 4,
                                        sepalWidth: 2 + Math.random() * 2,
                                        petalLength: 1 + Math.random() * 6,
                                        petalWidth: 0.1 + Math.random() * 2.4,
                                        species: i < 16 ? 'setosa' : i < 33 ? 'versicolor' : 'virginica'
                                    }));
                                    handleDataLoaded(sampleData);
                                }}
                                className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
                            >
                                Load Sample Data
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-900 p-2 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm sticky top-4 z-20">
                            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                            ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                                            }`}
                                    >
                                        <tab.icon size={16} />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setData(null)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                            >
                                <Upload size={16} /> New File
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm min-h-[500px]">
                            {activeTab === "overview" && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Descriptive Statistics</h3>
                                    <StatsSummary stats={stats} />
                                </div>
                            )}

                            {activeTab === "distributions" && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Variable Distributions</h3>
                                    <VariableExplorer data={data} />
                                </div>
                            )}

                            {activeTab === "correlations" && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Correlation Matrix</h3>

                                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Include Variables</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {stats && Object.keys(stats).map(col => (
                                                <button
                                                    key={col}
                                                    onClick={() => {
                                                        setSelectedCorrelationVars(prev =>
                                                            prev.includes(col)
                                                                ? prev.filter(c => c !== col)
                                                                : [...prev, col]
                                                        );
                                                    }}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${selectedCorrelationVars.includes(col)
                                                        ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                                                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                                        }`}
                                                >
                                                    {col}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <CorrelationHeatmap matrixData={correlationMatrix} />
                                </div>
                            )}

                            {activeTab === "relationships" && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bivariate Analysis</h3>
                                    <BivariateAnalysis data={data} />
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

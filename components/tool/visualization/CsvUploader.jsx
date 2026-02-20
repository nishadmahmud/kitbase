"use client";

import { useCallback } from "react";
import Papa from "papaparse";
import { UploadCloud, FileSpreadsheet } from "lucide-react";

export default function CsvUploader({ onDataLoaded }) {
    const handleFileUpload = useCallback(
        (e) => {
            const file = e.target.files[0];
            if (!file) return;

            Papa.parse(file, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: (results) => {
                    // Attempt to guess name and value columns
                    const data = results.data;
                    if (data && data.length > 0) {
                        // Find first string column for name
                        const firstKey = Object.keys(data[0])[0];
                        // Find first number column for value
                        const secondKey = Object.keys(data[0]).find(k => typeof data[0][k] === 'number') || Object.keys(data[0])[1];

                        // Normalize data mapping
                        const normalizedData = data.map((row) => ({
                            name: row[firstKey] !== undefined ? String(row[firstKey]) : "Unknown",
                            value: row[secondKey] !== undefined ? Number(row[secondKey]) : 0,
                            // keep original data too if needed later
                            ...row
                        }));

                        onDataLoaded(normalizedData);
                    }
                },
                error: (error) => {
                    console.error("CSV Parse Error:", error);
                },
            });
        },
        [onDataLoaded]
    );

    return (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors cursor-pointer relative bg-gray-50 dark:bg-gray-800/50 group">
            <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="w-6 h-6 text-indigo-500" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Upload CSV File</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-[200px]">
                Drag &amp; drop or click to upload. First column as Label, Second as Value.
            </p>
        </div>
    );
}

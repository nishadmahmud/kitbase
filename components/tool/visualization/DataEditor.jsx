"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function DataEditor({ data, onUpdate }) {
    const handleChange = (index, field, value) => {
        const newData = [...data];
        newData[index] = { ...newData[index], [field]: field === "value" ? Number(value) : value };
        onUpdate(newData);
    };

    const handleAddRow = () => {
        onUpdate([...data, { name: "New Item", value: 0 }]);
    };

    const handleRemoveRow = (index) => {
        const newData = data.filter((_, i) => i !== index);
        onUpdate(newData);
    };

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden flex flex-col h-full shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Data Editor</h3>
                <button
                    onClick={handleAddRow}
                    className="text-xs flex items-center gap-1 bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1 rounded-md transition-colors"
                >
                    <Plus size={14} /> Add Row
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                            <th className="pb-2 pl-2 font-medium">Label (Name)</th>
                            <th className="pb-2 font-medium">Value (Number)</th>
                            <th className="pb-2 w-8"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <td className="p-1">
                                    <input
                                        type="text"
                                        value={row.name}
                                        onChange={(e) => handleChange(index, "name", e.target.value)}
                                        className="w-full bg-transparent border border-transparent focus:border-indigo-500 rounded px-2 py-1 outline-none text-gray-700 dark:text-gray-200"
                                    />
                                </td>
                                <td className="p-1">
                                    <input
                                        type="number"
                                        value={row.value}
                                        onChange={(e) => handleChange(index, "value", e.target.value)}
                                        className="w-full bg-transparent border border-transparent focus:border-indigo-500 rounded px-2 py-1 outline-none text-gray-700 dark:text-gray-200"
                                    />
                                </td>
                                <td className="p-1 text-center">
                                    <button
                                        onClick={() => handleRemoveRow(index)}
                                        className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {data.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-xs">
                        No data available. Click &quot;Add Row&quot; to start.
                    </div>
                )}
            </div>
        </div>
    );
}

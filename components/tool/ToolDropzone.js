"use client";

import { useCallback, useState } from "react";
import { Upload } from "lucide-react";

export default function ToolDropzone({ onFiles, accept = "*", multiple = true, label, sublabel, supportedText }) {
    const [dragActive, setDragActive] = useState(false);

    const handleDrop = useCallback(
        (e) => {
            e.preventDefault();
            setDragActive(false);
            const files = Array.from(e.dataTransfer.files);
            if (files.length) onFiles(multiple ? files : [files[0]]);
        },
        [onFiles, multiple]
    );

    const handleChange = useCallback(
        (e) => {
            const files = Array.from(e.target.files);
            if (files.length) onFiles(multiple ? files : [files[0]]);
        },
        [onFiles, multiple]
    );

    return (
        <label
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center py-12 px-6 cursor-pointer border-2 border-dashed rounded-2xl transition-all duration-200 group ${dragActive
                ? "border-blue-500 bg-blue-50 dark:border-gray-500 dark:bg-gray-800"
                : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 hover:border-blue-400 dark:hover:border-gray-700 hover:bg-blue-50/50 dark:hover:bg-gray-900"
                }`}
        >
            <input type="file" accept={accept} multiple={multiple} onChange={handleChange} className="hidden" />
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors ${dragActive ? "bg-blue-100 dark:bg-gray-800" : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-gray-700"
                }`}>
                <Upload className="w-6 h-6 text-gray-400 dark:text-gray-200 group-hover:text-blue-500 dark:group-hover:text-gray-100 transition-colors" />
            </div>
            <p className="font-semibold text-gray-900 dark:text-gray-200 m-0 mb-1 text-[15px]">
                {label || "Drag & drop files here"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 m-0 mb-2">
                {sublabel || "or click to browse"}
            </p>
            {supportedText && (
                <p className="text-xs text-gray-500 dark:text-gray-400 m-0 transition-colors">{supportedText}</p>
            )}
        </label>
    );
}

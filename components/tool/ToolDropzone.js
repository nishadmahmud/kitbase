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
                ? "border-gray-500 bg-gray-800"
                : "border-gray-800 bg-gray-900/50 hover:border-gray-700 hover:bg-gray-900"
                }`}
        >
            <input type="file" accept={accept} multiple={multiple} onChange={handleChange} className="hidden" />
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors ${dragActive ? "bg-gray-800" : "bg-gray-800 group-hover:bg-gray-700"
                }`}>
                <Upload className="w-6 h-6 text-gray-200" />
            </div>
            <p className="font-semibold text-gray-200 m-0 mb-1 text-[15px]">
                {label || "Drag & drop files here"}
            </p>
            <p className="text-sm text-gray-500 m-0 mb-2">
                {sublabel || "or click to browse"}
            </p>
            {supportedText && (
                <p className="text-xs text-gray-600 m-0">{supportedText}</p>
            )}
        </label>
    );
}

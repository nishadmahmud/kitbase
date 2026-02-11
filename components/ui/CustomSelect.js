"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function CustomSelect({ value, onChange, options, className = "", buttonClassName = "", placeholder = "Select option" }) {
    // ... existing logic ...
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (newValue) => {
        onChange({ target: { value: newValue } });
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none ${buttonClassName}`}
            >
                <span className="truncate mr-2">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    size={16}
                    className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto py-1 animate-in fade-in zoom-in-95 duration-100">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleSelect(option.value)}
                            className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
                                ${option.value === value
                                    ? "text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10 font-medium"
                                    : "text-gray-700 dark:text-gray-200"
                                }`}
                        >
                            <span className="truncate">{option.label}</span>
                            {option.value === value && (
                                <Check size={14} className="text-blue-600 dark:text-blue-400 flex-shrink-0 ml-2" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

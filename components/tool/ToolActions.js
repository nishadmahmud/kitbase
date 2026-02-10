import { Loader2 } from "lucide-react";

export function ActionButton({ children, onClick, icon: Icon, variant = "primary", disabled, loading }) {
    const baseClasses = "inline-flex items-center justify-center gap-2 font-semibold text-[15px] rounded-xl px-7 py-3.5 transition-all duration-200 border border-transparent";

    const variants = {
        primary: "bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/25 border-transparent",
        secondary: "bg-transparent text-gray-200 border-gray-800 hover:bg-gray-800",
        danger: "bg-red-500 text-white hover:bg-red-600 border-transparent",
    };

    const disabledClasses = (disabled || loading) ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer";

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseClasses} ${variants[variant]} ${disabledClasses}`}
        >
            {loading ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : Icon && <Icon className="w-[18px] h-[18px]" />}
            {children}
        </button>
    );
}

export default function ToolActions({ children }) {
    return (
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            {children}
        </div>
    );
}

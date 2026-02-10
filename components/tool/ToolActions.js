import { Loader2 } from "lucide-react";

export function ActionButton({ children, onClick, icon: Icon, variant = "primary", disabled, loading }) {
    const baseStyle = {
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
        fontWeight: 600, fontSize: "15px", borderRadius: "12px",
        padding: "14px 28px", cursor: disabled ? "not-allowed" : "pointer",
        border: "none", transition: "all 0.2s",
        opacity: disabled ? 0.5 : 1,
    };

    const variants = {
        primary: { backgroundColor: "#4f8cff", color: "white", boxShadow: "0 4px 16px rgba(79,140,255,0.25)" },
        secondary: { backgroundColor: "transparent", color: "#e6e8ee", border: "1px solid #2a2f3a" },
        danger: { backgroundColor: "#f87171", color: "white" },
    };

    return (
        <button onClick={onClick} disabled={disabled || loading} style={{ ...baseStyle, ...variants[variant] }}>
            {loading ? <Loader2 style={{ width: "18px", height: "18px", animation: "spin 1s linear infinite" }} /> : Icon && <Icon style={{ width: "18px", height: "18px" }} />}
            {children}
        </button>
    );
}

export default function ToolActions({ children }) {
    return (
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "12px", marginTop: "24px" }}>
            {children}
        </div>
    );
}

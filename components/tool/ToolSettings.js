export function SettingRow({ label, children }) {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
            <label style={{ fontSize: "14px", fontWeight: 500, color: "#9aa0aa", flexShrink: 0 }}>{label}</label>
            <div>{children}</div>
        </div>
    );
}

export function SettingInput({ type = "number", value, onChange, ...props }) {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            style={{
                width: "120px", padding: "8px 12px", fontSize: "14px",
                backgroundColor: "#1a1e27", border: "1px solid #2a2f3a",
                borderRadius: "8px", color: "#e6e8ee",
                outline: "none", textAlign: "right",
            }}
            {...props}
        />
    );
}

export function SettingSelect({ value, onChange, options }) {
    return (
        <select
            value={value}
            onChange={onChange}
            style={{
                padding: "8px 12px", fontSize: "14px",
                backgroundColor: "#1a1e27", border: "1px solid #2a2f3a",
                borderRadius: "8px", color: "#e6e8ee",
                outline: "none", cursor: "pointer",
            }}
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    );
}

export default function ToolSettings({ children }) {
    return (
        <div style={{
            marginTop: "24px", padding: "24px",
            backgroundColor: "#171a21", border: "1px solid #2a2f3a",
            borderRadius: "16px",
            display: "flex", flexDirection: "column", gap: "16px",
        }}>
            {children}
        </div>
    );
}

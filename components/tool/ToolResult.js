import { CheckCircle, XCircle, Download } from "lucide-react";

export default function ToolResult({ success, message, downloadUrl, downloadName }) {
    return (
        <div
            style={{
                marginTop: "24px", padding: "24px", borderRadius: "16px",
                border: `1px solid ${success ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)"}`,
                backgroundColor: success ? "rgba(52,211,153,0.05)" : "rgba(248,113,113,0.05)",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {success ? (
                    <CheckCircle style={{ width: "20px", height: "20px", color: "#34d399", flexShrink: 0 }} />
                ) : (
                    <XCircle style={{ width: "20px", height: "20px", color: "#f87171", flexShrink: 0 }} />
                )}
                <p style={{ fontSize: "15px", color: success ? "#34d399" : "#f87171", margin: 0, fontWeight: 500 }}>{message}</p>
            </div>

            {success && downloadUrl && (
                <div style={{ marginTop: "16px", display: "flex", justifyContent: "center" }}>
                    <a
                        href={downloadUrl}
                        download={downloadName || "download"}
                        style={{
                            display: "inline-flex", alignItems: "center", gap: "8px",
                            padding: "12px 24px", backgroundColor: "#34d399", color: "#0f1115",
                            fontWeight: 600, fontSize: "14px", borderRadius: "10px", textDecoration: "none",
                        }}
                    >
                        <Download style={{ width: "16px", height: "16px" }} /> Download
                    </a>
                </div>
            )}
        </div>
    );
}

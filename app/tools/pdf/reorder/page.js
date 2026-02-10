"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const ReorderPdfClient = dynamic(() => import("./ReorderClient"), {
    ssr: false,
    loading: () => (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px", color: "#9aa0aa" }}>
            <Loader2 style={{ width: "24px", height: "24px", animation: "spin 1s linear infinite", marginRight: "8px" }} />
            Loading PDF Tools...
        </div>
    )
});

export default function ReorderPdfPage() {
    return <ReorderPdfClient />;
}

"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const ImageToPdfClient = dynamic(() => import("./ImageToPdfClient"), {
    ssr: false,
    loading: () => (
        <div className="flex justify-center items-center min-h-[400px] text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading Image Tools...
        </div>
    )
});

export default function ImageToPdfPage() {
    return <ImageToPdfClient />;
}

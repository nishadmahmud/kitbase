import { getToolByHref } from "@/lib/toolsRegistry";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const ReorderPdfClient = dynamic(() => import("./ReorderClient"), {
    ssr: false,
    loading: () => (
        <div className="flex justify-center items-center min-h-[400px] text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading PDF Tools...
        </div>
    )
});

export async function generateMetadata() {
    const tool = getToolByHref("/tools/pdf/reorder");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["reorder pdf", "organize pdf pages", "rearrange pdf", "pdf page sorter", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

export default function ReorderPdfPage() {
    return <ReorderPdfClient />;
}

import { getToolByHref } from "@/lib/toolsRegistry";
import WatermarkPdfClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/pdf/watermark");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["watermark pdf", "add watermark", "stamp pdf", "pdf watermark creator", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

export default function WatermarkPdfPage() {
    return <WatermarkPdfClient />;
}

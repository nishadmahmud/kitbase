import { getToolByHref } from "@/lib/toolsRegistry";
import PdfToImageClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/pdf/to-image");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["pdf to image", "pdf to jpg", "pdf to png", "convert pdf to image", "pdf converter free", "online pdf to image", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

export default function PdfToImagePage() {
    return <PdfToImageClient />;
}

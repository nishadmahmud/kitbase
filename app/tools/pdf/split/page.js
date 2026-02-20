import { getToolByHref } from "@/lib/toolsRegistry";
import SplitPdfClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/pdf/split");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["split pdf", "extract pdf pages", "separate pdf", "pdf splitter free", "online pdf splitter", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

export default function SplitPdfPage() {
    return <SplitPdfClient />;
}

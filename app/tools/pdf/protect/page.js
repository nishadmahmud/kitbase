import { getToolByHref } from "@/lib/toolsRegistry";
import ProtectPdfClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/pdf/protect");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["protect pdf", "encrypt pdf", "pdf password", "secure pdf", "pdf security", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

export default function ProtectPdfPage() {
    return <ProtectPdfClient />;
}

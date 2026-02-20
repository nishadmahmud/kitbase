import { getToolByHref } from "@/lib/toolsRegistry";
import UnlockPdfClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/pdf/unlock");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["unlock pdf", "remove pdf password", "decrypt pdf", "pdf unlocker", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

export default function UnlockPdfPage() {
    return <UnlockPdfClient />;
}

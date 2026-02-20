import { getToolByHref } from "@/lib/toolsRegistry";
import SignPdfClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/pdf/sign");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["sign pdf", "electronic signature", "digital signature", "sign pdf online", "draw signature", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";

export default function SignPdfPage() {
    const tool = getToolByHref("/tools/pdf/sign");
    const jsonLd = getToolSchema(tool);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <SignPdfClient />
        </>
    );
}

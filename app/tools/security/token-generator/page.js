import { getToolByHref } from "@/lib/toolsRegistry";
import TokenGeneratorClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/security/token-generator");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["token generator", "uuid generator", "api key generator", "random string", "authorization token", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";

export default function TokenGeneratorPage() {
    const tool = getToolByHref("/tools/security/token-generator");
    const jsonLd = getToolSchema(tool);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <TokenGeneratorClient />
        </>
    );
}

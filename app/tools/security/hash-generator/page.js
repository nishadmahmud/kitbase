import { getToolByHref } from "@/lib/toolsRegistry";
import HashGeneratorClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/security/hash-generator");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["hash generator", "sha1", "sha256", "sha512", "md5 hash", "secure hash", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";

export default function HashGeneratorPage() {
    const tool = getToolByHref("/tools/security/hash-generator");
    const jsonLd = getToolSchema(tool);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <HashGeneratorClient />
        </>
    );
}

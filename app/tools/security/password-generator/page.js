import { getToolByHref } from "@/lib/toolsRegistry";
import PasswordGeneratorClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/security/password-generator");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["password generator", "secure password", "random password", "password creator", "strong password", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";

export default function PasswordGeneratorPage() {
    const tool = getToolByHref("/tools/security/password-generator");
    const jsonLd = getToolSchema(tool);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PasswordGeneratorClient />
        </>
    );
}

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
import ToolContent from "@/components/global/ToolContent";
import RelatedTools from "@/components/global/RelatedTools";

export default function TokenGeneratorPage() {
    const tool = getToolByHref("/tools/security/token-generator");
    const jsonLd = getToolSchema(tool);

    const steps = [
        "Select the token format (UUID v4, hex, alphanumeric).",
        "Choose the token length if applicable.",
        "Click 'Generate' to create a unique token.",
        "Copy the token to use as an API key or session ID."
    ];

    const features = [
        { title: "UUID v4", description: "Generate RFC4122 compliant UUIDs for use in databases." },
        { title: "Hex Tokens", description: "Create secure hex-encoded tokens ideal for API keys." },
        { title: "Bulk Generation", description: "Generate multiple unique tokens at once." },
        { title: "Cryptographically Secure", description: "Tokens are generated with CSPRNG, not Math.random()." }
    ];

    const faq = [
        { question: "What is a UUID?", answer: "A UUID is a 128-bit Universally Unique Identifier, used to identify resources uniquely." },
        { question: "Can two tokens be the same?", answer: "The probability of collision is astronomically small with UUID v4." },
        { question: "Can I use this for API keys?", answer: "Yes, hex tokens are perfect for API keys and session tokens." }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <TokenGeneratorClient />
            <RelatedTools currentHref="/tools/security/token-generator" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}

import { getToolByHref } from "@/lib/toolsRegistry";
import CaesarCipherClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/crypto/caesar");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["caesar cipher", "shift cipher", "encrypt", "decrypt", "cryptography", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
            images: [{ url: `https://kitbase.tech/og?name=${encodeURIComponent(tool.name)}&desc=${encodeURIComponent(tool.description)}&cat=crypto`, width: 1200, height: 630, alt: `${tool.name} | Kitbase` }],
        },
        alternates: {
            canonical: `https://kitbase.tech/tools/crypto/caesar`,
        },
    };
}

import { getToolSchema, getBreadcrumbSchema, getHowToSchema, getFaqSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";
import RelatedTools from "@/components/global/RelatedTools";

export default function CaesarCipherPage() {
    const tool = getToolByHref("/tools/crypto/caesar");
    const jsonLd = getToolSchema(tool);
    const breadcrumbSchema = getBreadcrumbSchema(tool);

    const steps = [
        "Choose Encrypt or Decrypt mode.",
        "Set a shift value (e.g. 3).",
        "Type or paste your text in the input box.",
        "Copy the output result."
    ];

    const features = [
        { title: "Instant results", description: "Outputs update as you type with no server calls." },
        { title: "Case-preserving", description: "Uppercase and lowercase letters stay consistent." },
        { title: "Demo included", description: "Load an example to understand how the shift works." },
        { title: "Privacy-first", description: "Everything runs locally in your browser." }
    ];

    const faq = [
        { question: "Is Caesar Cipher secure?", answer: "No. It is a historical cipher and is easy to break. It’s useful for learning, not real security." },
        { question: "What characters are encrypted?", answer: "Only letters A–Z are shifted. Numbers, spaces, and punctuation are preserved." },
        { question: "How do I decrypt?", answer: "Switch to Decrypt mode and use the same shift value used to encrypt." }
    ];

    const howToSchema = getHowToSchema(tool, steps);
    const faqSchema = getFaqSchema(faq);

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <CaesarCipherClient />
            <RelatedTools currentHref="/tools/crypto/caesar" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}


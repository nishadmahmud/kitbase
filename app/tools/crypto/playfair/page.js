import { getToolByHref } from "@/lib/toolsRegistry";
import PlayfairCipherClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/crypto/playfair");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["playfair cipher", "digraph cipher", "encrypt", "decrypt", "cryptography", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
            images: [{ url: `https://kitbase.tech/og?name=${encodeURIComponent(tool.name)}&desc=${encodeURIComponent(tool.description)}&cat=crypto`, width: 1200, height: 630, alt: `${tool.name} | Kitbase` }],
        },
        alternates: {
            canonical: `https://kitbase.tech/tools/crypto/playfair`,
        },
    };
}

import { getToolSchema, getBreadcrumbSchema, getHowToSchema, getFaqSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";
import RelatedTools from "@/components/global/RelatedTools";

export default function PlayfairCipherPage() {
    const tool = getToolByHref("/tools/crypto/playfair");
    const jsonLd = getToolSchema(tool);
    const breadcrumbSchema = getBreadcrumbSchema(tool);

    const steps = [
        "Enter a keyword to generate the 5×5 key square.",
        "Choose Encrypt or Decrypt mode.",
        "Type or paste your text input.",
        "Copy the resulting output."
    ];

    const features = [
        { title: "Key square visualized", description: "See the generated 5×5 square instantly." },
        { title: "Classic digraph cipher", description: "Transforms text in letter pairs with simple geometric rules." },
        { title: "Demo included", description: "Load a canonical Playfair example to learn quickly." },
        { title: "Privacy-first", description: "Runs locally in your browser." }
    ];

    const faq = [
        { question: "What happens to the letter J?", answer: "Playfair usually combines I/J. This tool converts J→I." },
        { question: "Why do you insert X?", answer: "To avoid double letters in a pair (e.g. 'LL') and to pad an odd final letter." },
        { question: "Is Playfair secure?", answer: "No. It’s for education and classic cryptography demonstrations." }
    ];

    const howToSchema = getHowToSchema(tool, steps);
    const faqSchema = getFaqSchema(faq);

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <PlayfairCipherClient />
            <RelatedTools currentHref="/tools/crypto/playfair" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}


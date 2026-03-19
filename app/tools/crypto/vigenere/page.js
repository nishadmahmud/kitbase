import { getToolByHref } from "@/lib/toolsRegistry";
import VigenereCipherClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/crypto/vigenere");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["vigenere cipher", "polyalphabetic cipher", "encrypt", "decrypt", "cryptography", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
            images: [{ url: `https://kitbase.tech/og?name=${encodeURIComponent(tool.name)}&desc=${encodeURIComponent(tool.description)}&cat=crypto`, width: 1200, height: 630, alt: `${tool.name} | Kitbase` }],
        },
        alternates: {
            canonical: `https://kitbase.tech/tools/crypto/vigenere`,
        },
    };
}

import { getToolSchema, getBreadcrumbSchema, getHowToSchema, getFaqSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";
import RelatedTools from "@/components/global/RelatedTools";

export default function VigenereCipherPage() {
    const tool = getToolByHref("/tools/crypto/vigenere");
    const jsonLd = getToolSchema(tool);
    const breadcrumbSchema = getBreadcrumbSchema(tool);

    const steps = [
        "Choose Encrypt or Decrypt mode.",
        "Enter a keyword (letters only).",
        "Type or paste your text in the input box.",
        "Copy the output result."
    ];

    const features = [
        { title: "Keyword-based", description: "A different shift is used for each letter based on the keyword." },
        { title: "Instant results", description: "Runs entirely in your browser." },
        { title: "Demo included", description: "Load a classic example to learn the cipher quickly." },
        { title: "Privacy-first", description: "No uploads. Your text stays local." }
    ];

    const faq = [
        { question: "Is Vigenère secure?", answer: "Not by modern standards. It’s an educational cipher used to understand classical cryptography." },
        { question: "Does it preserve spaces?", answer: "Yes. Non-letter characters are preserved as-is." },
        { question: "What if my keyword includes symbols?", answer: "Only letters A–Z from the keyword are used." }
    ];

    const howToSchema = getHowToSchema(tool, steps);
    const faqSchema = getFaqSchema(faq);

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <VigenereCipherClient />
            <RelatedTools currentHref="/tools/crypto/vigenere" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}


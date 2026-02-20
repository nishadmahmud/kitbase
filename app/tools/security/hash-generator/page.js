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
            images: [{ url: `https://kitbase.tech/og?name=${encodeURIComponent(tool.name)}&desc=${encodeURIComponent(tool.description)}&cat=security`, width: 1200, height: 630, alt: `${tool.name} | Kitbase` }],
        },
        alternates: {
            canonical: `https://kitbase.tech/tools/security/hash-generator`,
        },
    };
}

import { getToolSchema, getBreadcrumbSchema, getHowToSchema, getFaqSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";
import RelatedTools from "@/components/global/RelatedTools";

export default function HashGeneratorPage() {
    const tool = getToolByHref("/tools/security/hash-generator");
    const jsonLd = getToolSchema(tool);
    const breadcrumbSchema = getBreadcrumbSchema(tool);

    const steps = [
        "Type or paste your text into the input field.",
        "Select the hashing algorithm (MD5, SHA-1, SHA-256, SHA-512).",
        "The hash is computed and displayed instantly.",
        "Copy the hash for use in your application."
    ];

    const features = [
        { title: "Multiple Algorithms", description: "Supports MD5, SHA-1, SHA-256, SHA-512, and more." },
        { title: "Instant Hashing", description: "Computes the hash as you type, with zero delay." },
        { title: "100% Client-Side", description: "Your text never leaves your browser. Total privacy guaranteed." },
        { title: "File Hashing", description: "Upload a file to generate its hash and verify integrity." }
    ];

    const faq = [
        { question: "Can I reverse a hash?", answer: "No. Cryptographic hashes are one-way functions and cannot be reversed." },
        { question: "What is SHA-256 used for?", answer: "SHA-256 is used in blockchain, password storage, and data integrity verification." },
        { question: "Is MD5 secure?", answer: "MD5 is not recommended for cryptographic security, but is fine for checksums." }
    ];

    const howToSchema = getHowToSchema(tool, steps);

    const faqSchema = getFaqSchema(faq);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <HashGeneratorClient />
            <RelatedTools currentHref="/tools/security/hash-generator" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}

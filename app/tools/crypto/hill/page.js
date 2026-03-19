import { getToolByHref } from "@/lib/toolsRegistry";
import HillCipherClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/crypto/hill");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["hill cipher", "matrix cipher", "encrypt", "decrypt", "cryptography", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
            images: [{ url: `https://kitbase.tech/og?name=${encodeURIComponent(tool.name)}&desc=${encodeURIComponent(tool.description)}&cat=crypto`, width: 1200, height: 630, alt: `${tool.name} | Kitbase` }],
        },
        alternates: {
            canonical: `https://kitbase.tech/tools/crypto/hill`,
        },
    };
}

import { getToolSchema, getBreadcrumbSchema, getHowToSchema, getFaqSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";
import RelatedTools from "@/components/global/RelatedTools";

export default function HillCipherPage() {
    const tool = getToolByHref("/tools/crypto/hill");
    const jsonLd = getToolSchema(tool);
    const breadcrumbSchema = getBreadcrumbSchema(tool);

    const steps = [
        "Enter a 2×2 key matrix (a b c d).",
        "Make sure the matrix is invertible mod 26.",
        "Choose Encrypt or Decrypt and type your text.",
        "Copy the output."
    ];

    const features = [
        { title: "Matrix validation", description: "Warns when the key matrix is not invertible mod 26." },
        { title: "Classic linear algebra cipher", description: "Demonstrates how matrices can encrypt digraphs." },
        { title: "Demo included", description: "Load a working key and sample input instantly." },
        { title: "Privacy-first", description: "Runs locally in your browser." }
    ];

    const faq = [
        { question: "Why does the key need to be invertible?", answer: "Decryption requires the modular inverse of the key matrix. If it doesn’t exist, you cannot decrypt." },
        { question: "What alphabet is used?", answer: "A–Z mapped to 0–25, with all other characters removed for the transformation." },
        { question: "Is Hill Cipher secure?", answer: "No. It’s educational and can be broken with modern methods." }
    ];

    const howToSchema = getHowToSchema(tool, steps);
    const faqSchema = getFaqSchema(faq);

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <HillCipherClient />
            <RelatedTools currentHref="/tools/crypto/hill" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}


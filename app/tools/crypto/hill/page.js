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
        "Enter n² numbers for an n×n key matrix (e.g. 4 numbers for 2×2, 9 for 3×3).",
        "Make sure the matrix is invertible mod 26 (gcd of the determinant and 26 must be 1).",
        "Choose Encrypt or Decrypt and type your text.",
        "Copy the output."
    ];

    const features = [
        { title: "Any square size", description: "Supports 2×2, 3×3, and larger n×n keys — not just digraphs." },
        { title: "Matrix validation", description: "Warns when the key matrix is not invertible mod 26." },
        { title: "Classic linear algebra cipher", description: "Encrypts letter blocks of length n with matrix multiplication." },
        { title: "Demo included", description: "Load a working key and sample input instantly." },
        { title: "Privacy-first", description: "Runs locally in your browser." }
    ];

    const faq = [
        { question: "Why does the key need to be invertible?", answer: "Decryption requires the modular inverse of the key matrix. If it doesn’t exist, you cannot decrypt." },
        { question: "What sizes work?", answer: "Any n×n matrix with n ≥ 2. Enter exactly n² numbers (row by row)." },
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


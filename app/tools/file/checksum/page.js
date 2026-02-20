import { getToolByHref } from "@/lib/toolsRegistry";
import ChecksumVerifierClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/file/checksum");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["checksum verifier", "hash calculator", "file hash", "sha256", "md5", "verify file integrity", "kitbase"],
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

export default function ChecksumVerifierPage() {
    const tool = getToolByHref("/tools/file/checksum");
    const jsonLd = getToolSchema(tool);

    const steps = [
        "Upload the file you want to verify.",
        "Select the hash algorithm (MD5, SHA-1, SHA-256).",
        "Wait for the hash to be computed (all in your browser).",
        "Compare the generated hash against the expected hash from your source."
    ];

    const features = [
        { title: "File Integrity Check", description: "Verify that a downloaded file hasn't been corrupted or tampered with." },
        { title: "Multiple Algorithms", description: "Supports MD5, SHA-1, SHA-256, and SHA-512." },
        { title: "Large File Support", description: "Handles large files using streaming, without crashing your browser." },
        { title: "Completely Private", description: "Your file is never uploaded; hashing is done locally." }
    ];

    const faq = [
        { question: "Why verify a checksum?", answer: "To ensure a downloaded file is identical to the original and hasn't been modified by malware." },
        { question: "Which algorithm should I use?", answer: "Use SHA-256 for modern security needs. MD5 is faster but less secure." },
        { question: "Is my file uploaded?", answer: "No. The entire checksum computation happens inside your browser." }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ChecksumVerifierClient />
            <RelatedTools currentHref="/tools/file/checksum" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}

import { getToolByHref } from "@/lib/toolsRegistry";
import ProtectPdfClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/pdf/protect");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["protect pdf", "encrypt pdf", "pdf password", "secure pdf", "pdf security", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";

export default function ProtectPdfPage() {
    const tool = getToolByHref("/tools/pdf/protect");
    const jsonLd = getToolSchema(tool);

    const steps = [
        "Upload the PDF you want to secure.",
        "Enter a strong password in the password field.",
        "Confirm the password to avoid typos.",
        "Download your newly encrypted and protected PDF."
    ];

    const features = [
        { title: "Strong Encryption", description: "Uses standard 128-bit AES encryption to secure your document." },
        { title: "Instant Protection", description: "Protect your sensitive files in seconds." },
        { title: "No Server Uploads", description: "Encryption happens locally. We never see your password or file." },
        { title: "Cross-Platform", description: "Protected PDFs work on all standard PDF readers." }
    ];

    const faq = [
        { question: "What if I forget the password?", answer: "If the password is lost, the file cannot be recovered. Please remember it!" },
        { question: "Is it really secure?", answer: "Yes, without the password, the content is encrypted and unreadable junk data." },
        { question: "Can I remove the password later?", answer: "Yes, use our Unlock PDF tool with the correct password to remove protection." }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProtectPdfClient />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}

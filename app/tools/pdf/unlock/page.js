import { getToolByHref } from "@/lib/toolsRegistry";
import UnlockPdfClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/pdf/unlock");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["unlock pdf", "remove pdf password", "decrypt pdf", "pdf unlocker", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
            images: [{ url: `https://kitbase.tech/og?name=${encodeURIComponent(tool.name)}&desc=${encodeURIComponent(tool.description)}&cat=pdf`, width: 1200, height: 630, alt: `${tool.name} | Kitbase` }],
        },
        alternates: {
            canonical: `https://kitbase.tech/tools/pdf/unlock`,
        },
    };
}

import { getToolSchema, getBreadcrumbSchema, getHowToSchema, getFaqSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";
import RelatedTools from "@/components/global/RelatedTools";

export default function UnlockPdfPage() {
    const tool = getToolByHref("/tools/pdf/unlock");
    const jsonLd = getToolSchema(tool);
    const breadcrumbSchema = getBreadcrumbSchema(tool);

    const steps = [
        "Select your password-protected PDF file.",
        "Enter the correct password to authorize decryption.",
        "Click 'Unlock' to remove the security restrictions.",
        "Download the unsecured version of your file."
    ];

    const features = [
        { title: "Remove Restrictions", description: "Strip printing, copying, and editing restrictions from your PDFs." },
        { title: "Permanent Unlock", description: "Create a new version of the file that no longer requires a password." },
        { title: "Safe Handling", description: "Decryption is done in your browser for maximum confidentiality." },
        { title: "Fast Processing", description: "Instantly removes security layers once authorized." }
    ];

    const faq = [
        { question: "Can it crack forgotten passwords?", answer: "No, this tool removes known passwords. It is not a hacking tool." },
        { question: "Why do I need to enter the password?", answer: "To verify you have the right to modify the document security settings." },
        { question: "Is the new file same quality?", answer: "Yes, the content remains exactly the same, only security metadata is removed." }
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
            <UnlockPdfClient />
            <RelatedTools currentHref="/tools/pdf/unlock" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}

import { getToolByHref } from "@/lib/toolsRegistry";
import QrCodeClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/dev/qr-code");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["qr code generator", "create qr code", "qr maker", "qr code creator", "wifi qr code", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";

export default function QrCodeGeneratorPage() {
    const tool = getToolByHref("/tools/dev/qr-code");
    const jsonLd = getToolSchema(tool);

    const steps = [
        "Enter the URL or text you want to encode.",
        "Adjust customization options like size and error correction level.",
        "Watch the QR code update in real-time.",
        "Download the generated QR code as a PNG image."
    ];

    const features = [
        { title: "High Resolution", description: "Generate crisp, high-quality QR codes suitable for printing." },
        { title: "Customizable", description: "Control the size and error correction level to fit your needs." },
        { title: "No Expiration", description: "The QR codes generated are static and will work forever. No redirection or tracking." },
        { title: "Instant Download", description: "Download your QR code immediately in standard PNG format." }
    ];

    const faq = [
        { question: "Do these QR codes expire?", answer: "No, never. They directly encode your text/URL, so they will work as long as your link works." },
        { question: "Can I use them commercially?", answer: "Yes, you are free to use these QR codes for any personal or commercial purpose." },
        { question: "What is Error Correction?", answer: "It allows the QR code to be scanned even if part of it is damaged or covered. Higher levels are more robust but make the code more complex." }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <QrCodeClient />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}

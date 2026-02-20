import { getToolByHref } from "@/lib/toolsRegistry";
import SignPdfClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/pdf/sign");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["sign pdf", "electronic signature", "digital signature", "sign pdf online", "draw signature", "kitbase"],
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

export default function SignPdfPage() {
    const tool = getToolByHref("/tools/pdf/sign");
    const jsonLd = getToolSchema(tool);

    const steps = [
        "Open your PDF document in the signing tool.",
        "Create your signature by drawing, typing, or uploading an image.",
        "Drag your signature to the correct place on the document.",
        "Save and download the signed PDF."
    ];

    const features = [
        { title: "Multiple Ways to Sign", description: "Draw with your mouse/touch, type your name, or upload a signature image." },
        { title: "Place Anywhere", description: "Easily position and resize your signature on any page." },
        { title: "eSignature Ready", description: "Create professional-looking signed documents in minutes." },
        { title: "Secure & Private", description: "Your signature and document are processed locally and never stored." }
    ];

    const faq = [
        { question: "Is this legally binding?", answer: "While many jurisdictions accept e-signatures, please consult local laws for critical legal documents." },
        { question: "Can I save my signature?", answer: "For security, signatures are not stored between sessions. Please recreate it each time." },
        { question: "Does it work on mobile?", answer: "Yes, drawing a signature is especially easy on touchscreens." }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <SignPdfClient />
            <RelatedTools currentHref="/tools/pdf/sign" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}

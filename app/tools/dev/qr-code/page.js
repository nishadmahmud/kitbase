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
            images: [{ url: `https://kitbase.tech/og?name=${encodeURIComponent(tool.name)}&desc=${encodeURIComponent(tool.description)}&cat=dev`, width: 1200, height: 630, alt: `${tool.name} | Kitbase` }],
        },
        alternates: {
            canonical: `https://kitbase.tech/tools/dev/qr-code`,
        },
    };
}

import { getToolSchema, getBreadcrumbSchema, getHowToSchema, getFaqSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";
import RelatedTools from "@/components/global/RelatedTools";
import Link from "next/link";
import { ChevronRight, Shield, Home } from "lucide-react";

export default function QrCodeGeneratorPage() {
    const tool = getToolByHref("/tools/dev/qr-code");
    const jsonLd = getToolSchema(tool);
    const breadcrumbSchema = getBreadcrumbSchema(tool);

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
            <div className="min-h-screen bg-slate-50 dark:bg-gray-950 pb-12 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 pt-10">
                    <div className="mb-10">
                        <nav className="flex items-center gap-1.5 text-sm mb-4 text-gray-500 dark:text-gray-500 overflow-x-auto no-scrollbar whitespace-nowrap">
                            <Link href="/" className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors no-underline flex items-center gap-1">
                                <Home size={14} />
                                <span className="hidden sm:inline">Home</span>
                            </Link>
                            <span className="flex items-center gap-1.5">
                                <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600 block flex-shrink-0" />
                                <Link href="/all-tools" className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors no-underline">Tools</Link>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600 block flex-shrink-0" />
                                <Link href="/category/dev" className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors no-underline">Developer Tools</Link>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600 block flex-shrink-0" />
                                <span className="text-gray-900 dark:text-gray-200 font-medium">QR Code Generator</span>
                            </span>
                        </nav>

                        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 tracking-tight leading-tight">
                            QR Code Generator
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed max-w-3xl">
                            Create customized QR codes for links, text, Wi‑Fi access, and email. This tool runs locally in your browser for speed and privacy.
                        </p>

                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                            <Shield className="w-3.5 h-3.5" />
                            <span>Client-side only. Data never leaves your device.</span>
                        </div>
                    </div>
                </div>

                <QrCodeClient />
            </div>
            <RelatedTools currentHref="/tools/dev/qr-code" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}

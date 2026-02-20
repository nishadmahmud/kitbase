import { getToolByHref } from "@/lib/toolsRegistry";
import XmlFormatterClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/dev/xml-formatter");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["xml formatter", "xml beautifier", "format xml", "xml validator", "xml beautify", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
            images: [{ url: `https://kitbase.tech/og?name=${encodeURIComponent(tool.name)}&desc=${encodeURIComponent(tool.description)}&cat=dev`, width: 1200, height: 630, alt: `${tool.name} | Kitbase` }],
        },
        alternates: {
            canonical: `https://kitbase.tech/tools/dev/xml-formatter`,
        },
    };
}

import { getToolSchema, getBreadcrumbSchema, getHowToSchema, getFaqSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";
import RelatedTools from "@/components/global/RelatedTools";

export default function XmlFormatterPage() {
    const tool = getToolByHref("/tools/dev/xml-formatter");
    const jsonLd = getToolSchema(tool);
    const breadcrumbSchema = getBreadcrumbSchema(tool);

    const steps = [
        "Paste your minified or unformatted XML into the editor.",
        "Click the format button to indent and structure the XML.",
        "Optionally copy the result or download it as a file.",
        "If the XML is invalid, an error message will guide you."
    ];

    const features = [
        { title: "Validation", description: "Checks for well-formed XML and reports syntax errors." },
        { title: "Proper Indentation", description: "Standardizes spacing and nesting for maximum readability." },
        { title: "Tree View", description: "Visualize the XML hierarchy clearly." },
        { title: "Offline Capable", description: "Works without an internet connection once loaded." }
    ];

    const faq = [
        { question: "Can it format SVG?", answer: "Yes, since SVG is XML-based, it works perfectly for beautifying SVG code." },
        { question: "Does it support DTD verification?", answer: "Currently it checks for well-formedness but does not validate against external DTDs." },
        { question: "Is there a file size limit?", answer: "It handles typical configuration and data files easily." }
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
            <XmlFormatterClient />
            <RelatedTools currentHref="/tools/dev/xml-formatter" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}

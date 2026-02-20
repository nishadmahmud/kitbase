import { getToolByHref } from "@/lib/toolsRegistry";
import GradientGeneratorClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/design/gradient-generator");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["gradient generator", "css gradient", "background styles", "web design tools", "color gradients", "css 3", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
            images: [{ url: `https://kitbase.tech/og?name=${encodeURIComponent(tool.name)}&desc=${encodeURIComponent(tool.description)}&cat=design`, width: 1200, height: 630, alt: `${tool.name} | Kitbase` }],
        },
        alternates: {
            canonical: `https://kitbase.tech/tools/design/gradient-generator`,
        },
    };
}

import { getToolSchema, getBreadcrumbSchema, getHowToSchema, getFaqSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";
import RelatedTools from "@/components/global/RelatedTools";

export default function GradientGeneratorPage() {
    const tool = getToolByHref("/tools/design/gradient-generator");
    const jsonLd = getToolSchema(tool);
    const breadcrumbSchema = getBreadcrumbSchema(tool);

    const steps = [
        "Choose linear or radial gradient type.",
        "Pick your start and end colors using the color pickers.",
        "Adjust the gradient angle or position.",
        "Copy the generated CSS code to use in your project."
    ];

    const features = [
        { title: "Linear & Radial", description: "Create both linear and radial gradient styles." },
        { title: "CSS Output", description: "Instantly generates copy-paste-ready CSS background code." },
        { title: "Multi-Stop Gradients", description: "Add multiple color stops for complex, beautiful gradients." },
        { title: "Live Preview", description: "See the gradient update in real time as you tweak settings." }
    ];

    const faq = [
        { question: "What is a CSS gradient?", answer: "A CSS gradient is a smooth color transition you can use as a background without an image." },
        { question: "Can I have more than 2 colors?", answer: "Yes, you can add multiple color stops." },
        { question: "Does it work in all browsers?", answer: "Yes, modern CSS gradients work in all modern browsers." }
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
            <GradientGeneratorClient />
            <RelatedTools currentHref="/tools/design/gradient-generator" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}

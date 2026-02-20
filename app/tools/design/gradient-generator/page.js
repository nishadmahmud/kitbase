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
        },
    };
}

import { getToolSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";

export default function GradientGeneratorPage() {
    const tool = getToolByHref("/tools/design/gradient-generator");
    const jsonLd = getToolSchema(tool);

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

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <GradientGeneratorClient />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}

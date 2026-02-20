import { getToolByHref } from "@/lib/toolsRegistry";
import ColorConverterClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/design/color-converter");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["color converter", "hex to rgb", "rgb to hex", "color picker", "web colors", "hsl converter", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";

export default function ColorConverterPage() {
    const tool = getToolByHref("/tools/design/color-converter");
    const jsonLd = getToolSchema(tool);

    const steps = [
        "Enter a color value in any supported format (HEX, RGB, HSL).",
        "The tool instantly converts it to all other formats.",
        "Use the visual color picker to select a color by eye.",
        "Copy any of the converted values with one click."
    ];

    const features = [
        { title: "Multi-Format", description: "Converts between HEX, RGB, HSL, and HSV color models." },
        { title: "Visual Picker", description: "Select colors visually with an interactive color wheel." },
        { title: "Instant Conversion", description: "All formats update simultaneously as you type or pick." },
        { title: "Copy Any Format", description: "One-click copy for each color format output." }
    ];

    const faq = [
        { question: "What is HEX?", answer: "HEX is a 6-digit code used in web design, e.g., #FF5733." },
        { question: "What is HSL?", answer: "HSL stands for Hue, Saturation, Lightness and is more intuitive for designers." },
        { question: "Can I use this for CSS?", answer: "Yes, all output formats are ready to paste directly into CSS." }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ColorConverterClient />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}

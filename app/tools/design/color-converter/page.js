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

export default function ColorConverterPage() {
    return <ColorConverterClient />;
}

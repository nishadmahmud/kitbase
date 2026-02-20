import { getToolByHref } from "@/lib/toolsRegistry";
import ConvertImageClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/image/convert");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["convert image", "image converter", "png to jpg", "jpg to png", "webp converter", "image format", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

export default function ConvertImagePage() {
    return <ConvertImageClient />;
}

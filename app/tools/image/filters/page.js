import { getToolByHref } from "@/lib/toolsRegistry";
import ImageFiltersClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/image/filters");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["image filters", "photo editor", "image adjustments", "photo brightness", "photo contrast", "kitbase", "instagram filters online"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

export default function ImageFiltersPage() {
    return <ImageFiltersClient />;
}

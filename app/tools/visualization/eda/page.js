import { getToolByHref } from "@/lib/toolsRegistry";
import EdaClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/visualization/eda");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["eda", "exploratory data analysis", "correlation heatmap", "data visualization", "statistics", "csv analysis", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

export default function EdaPage() {
    return <EdaClient />;
}

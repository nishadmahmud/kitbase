import { getToolByHref } from "@/lib/toolsRegistry";
import MetadataViewerClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/file/metadata");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["metadata viewer", "exif viewer", "pdf metadata", "image metadata", "video metadata", "file properties", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

export default function MetadataViewerPage() {
    return <MetadataViewerClient />;
}

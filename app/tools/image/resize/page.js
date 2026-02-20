import { getToolByHref } from "@/lib/toolsRegistry";
import ResizeImageClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/image/resize");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["resize image", "image resizer", "photo resizer", "resize jpg", "resize png", "web resizer", "online image resize", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

export default function ResizeImagePage() {
    return <ResizeImageClient />;
}

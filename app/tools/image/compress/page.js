import { getToolByHref } from "@/lib/toolsRegistry";
import CompressImageClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/image/compress");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["compress image", "image compressor", "shrink image", "reduce image size", "jpg compress", "png compress", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

export default function CompressImagePage() {
    return <CompressImageClient />;
}

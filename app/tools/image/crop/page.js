import { getToolByHref } from "@/lib/toolsRegistry";
import ImageCropperClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/image/crop");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["crop image", "image cropper", "photo crop online", "trim image", "photo cropper", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

export default function ImageCropperPage() {
    return <ImageCropperClient />;
}

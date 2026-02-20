import { getToolByHref } from "@/lib/toolsRegistry";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const ImageToPdfClient = dynamic(() => import("./ImageToPdfClient"), {
    ssr: false,
    loading: () => (
        <div className="flex justify-center items-center min-h-[400px] text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading Image Tools...
        </div>
    )
});

export async function generateMetadata() {
    const tool = getToolByHref("/tools/pdf/from-image");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["image to pdf", "jpg to pdf", "png to pdf", "images to pdf converter", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";

export default function ImageToPdfPage() {
    const tool = getToolByHref("/tools/pdf/from-image");
    const jsonLd = getToolSchema(tool);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ImageToPdfClient />
        </>
    );
}

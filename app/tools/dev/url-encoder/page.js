import { getToolByHref } from "@/lib/toolsRegistry";
import UrlEncoderClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/dev/url-encoder");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["url encoder", "url decoder", "percent encoding", "url escape", "url unescape", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

export default function UrlEncoderPage() {
    return <UrlEncoderClient />;
}

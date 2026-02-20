import { getToolByHref } from "@/lib/toolsRegistry";
import ChecksumVerifierClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/file/checksum");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["checksum verifier", "hash calculator", "file hash", "sha256", "md5", "verify file integrity", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

export default function ChecksumVerifierPage() {
    return <ChecksumVerifierClient />;
}

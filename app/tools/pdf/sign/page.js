import { getToolByHref } from "@/lib/toolsRegistry";
import SignPdfClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/pdf/sign");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["sign pdf", "electronic signature", "digital signature", "sign pdf online", "draw signature", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

export default function SignPdfPage() {
    return <SignPdfClient />;
}

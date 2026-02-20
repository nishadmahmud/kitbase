import { getToolByHref } from "@/lib/toolsRegistry";
import QrCodeClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/dev/qr-code");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["qr code generator", "create qr code", "qr maker", "qr code creator", "wifi qr code", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

export default function QrCodePage() {
    return <QrCodeClient />;
}

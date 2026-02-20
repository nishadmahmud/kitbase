import { getToolByHref } from "@/lib/toolsRegistry";
import WorldClockClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/productivity/world-clock");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["world clock", "timezone converter", "international time", "utc time", "current time", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

export default function WorldClockPage() {
    return <WorldClockClient />;
}

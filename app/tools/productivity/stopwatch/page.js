import { getToolByHref } from "@/lib/toolsRegistry";
import StopwatchClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/productivity/stopwatch");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["online stopwatch", "lap timer", "digital stopwatch", "timer", "chronometer", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

export default function StopwatchPage() {
    return <StopwatchClient />;
}

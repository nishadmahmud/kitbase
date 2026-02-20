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

import { getToolSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";

export default function WorldClockPage() {
    const tool = getToolByHref("/tools/productivity/world-clock");
    const jsonLd = getToolSchema(tool);

    const steps = [
        "Your local time is shown by default.",
        "Search for and add cities or timezones you want to track.",
        "View the current time in all your added locations simultaneously.",
        "Use the converter to find meeting times across zones."
    ];

    const features = [
        { title: "Live Time", description: "Displays the live current time for every timezone." },
        { title: "DST Aware", description: "Automatically accounts for Daylight Saving Time changes." },
        { title: "Meeting Planner", description: "Find a time that works for participants in different countries." },
        { title: "500+ Timezones", description: "Covers all IANA timezones worldwide." }
    ];

    const faq = [
        { question: "What is UTC?", answer: "UTC (Coordinated Universal Time) is the primary time standard by which the world regulates clocks." },
        { question: "Does it handle DST?", answer: "Yes, it automatically adjusts for Daylight Saving Time based on the location." },
        { question: "Can I save my timezone list?", answer: "Yes, your selections are saved locally in your browser." }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <WorldClockClient />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}

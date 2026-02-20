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

import { getToolSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";

export default function StopwatchPage() {
    const tool = getToolByHref("/tools/productivity/stopwatch");
    const jsonLd = getToolSchema(tool);

    const steps = [
        "Click 'Start' to begin timing.",
        "Click 'Lap' to record intermediate times without stopping.",
        "Click 'Stop' to pause the timer.",
        "Click 'Reset' to clear all times and start over."
    ];

    const features = [
        { title: "Lap Tracking", description: "Record multiple lap times without stopping the main timer." },
        { title: "Millisecond Precision", description: "Accurate to the millisecond for precise time tracking." },
        { title: "No Installation", description: "Works directly in your browser, no app download required." },
        { title: "Keyboard Shortcuts", description: "Control the stopwatch without touching your mouse." }
    ];

    const faq = [
        { question: "Does it work if I switch tabs?", answer: "Yes, the timer continues running even if you switch browser tabs." },
        { question: "Can I export lap times?", answer: "You can copy the lap time list to paste into a document." },
        { question: "Is it accurate?", answer: "Yes, we use the browser's high-resolution performance timer for accuracy." }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <StopwatchClient />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}

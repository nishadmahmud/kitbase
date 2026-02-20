import { getToolByHref } from "@/lib/toolsRegistry";
import PomodoroClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/productivity/pomodoro");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["pomodoro timer", "productivity timer", "focus timer", "tomato timer", "study timer", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
            images: [{ url: `https://kitbase.tech/og?name=${encodeURIComponent(tool.name)}&desc=${encodeURIComponent(tool.description)}&cat=productivity`, width: 1200, height: 630, alt: `${tool.name} | Kitbase` }],
        },
        alternates: {
            canonical: `https://kitbase.tech/tools/productivity/pomodoro`,
        },
    };
}

import { getToolSchema, getBreadcrumbSchema, getHowToSchema, getFaqSchema } from "@/lib/seo";

import ToolContent from "@/components/global/ToolContent";
import RelatedTools from "@/components/global/RelatedTools";

export default function PomodoroPage() {
    const tool = getToolByHref("/tools/productivity/pomodoro");
    const jsonLd = getToolSchema(tool);
    const breadcrumbSchema = getBreadcrumbSchema(tool);

    const content = {
        title: "Pomodoro Timer",
        steps: [
            "Set your focus duration (default is 25 minutes).",
            "Click 'Start' to begin your focus session.",
            "Take a short break (5 mins) when the alarm rings.",
            "After 4 cycles, take a long break (15 mins)."
        ],
        features: [
            { title: "Customizable Intervals", description: "Adjust work, short break, and long break durations to suit your workflow." },
            { title: "Audio Notifications", description: "Get a gentle sound alert when your timer ends so you never miss a break." }
        ],
        faq: [
            { question: "What is the Pomodoro Technique?", answer: "It's a time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks." },
            { question: "Can I use this offline?", answer: "Yes! Once loaded, the timer works perfectly without an internet connection." }
        ]
    };

    const howToSchema = getHowToSchema(tool, steps);

    const faqSchema = getFaqSchema(faq);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <PomodoroClient />
            <RelatedTools currentHref="/tools/productivity/pomodoro" />
            <ToolContent {...content} />
        </>
    );
}

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
        },
    };
}

export default function PomodoroPage() {
    return <PomodoroClient />;
}

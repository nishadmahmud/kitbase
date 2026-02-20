import { getToolByHref } from "@/lib/toolsRegistry";
import PercentageCalculatorClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/calculator/percentage");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["percentage calculator", "calculate percentage", "percent change", "what is percentage", "math tools", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

export default function PercentageCalculatorPage() {
    return <PercentageCalculatorClient />;
}

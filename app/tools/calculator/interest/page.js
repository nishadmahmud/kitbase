import { getToolByHref } from "@/lib/toolsRegistry";
import InterestCalculatorClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/calculator/interest");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["interest calculator", "simple interest", "compound interest", "investment calculator", "money growth", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

export default function InterestCalculatorPage() {
    return <InterestCalculatorClient />;
}

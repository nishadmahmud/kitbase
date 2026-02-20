import { getToolByHref } from "@/lib/toolsRegistry";
import LoanCalculatorClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/calculator/loan");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["loan calculator", "mortgage calculator", "auto loan calculator", "monthly payments", "interest calculator", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

export default function LoanCalculatorPage() {
    return <LoanCalculatorClient />;
}

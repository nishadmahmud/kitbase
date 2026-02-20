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
            images: [{ url: `https://kitbase.tech/og?name=${encodeURIComponent(tool.name)}&desc=${encodeURIComponent(tool.description)}&cat=calculator`, width: 1200, height: 630, alt: `${tool.name} | Kitbase` }],
        },
        alternates: {
            canonical: `https://kitbase.tech/tools/calculator/loan`,
        },
    };
}

import { getToolSchema, getBreadcrumbSchema, getHowToSchema, getFaqSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";
import RelatedTools from "@/components/global/RelatedTools";

export default function LoanCalculatorPage() {
    const tool = getToolByHref("/tools/calculator/loan");
    const jsonLd = getToolSchema(tool);
    const breadcrumbSchema = getBreadcrumbSchema(tool);

    const steps = [
        "Enter the loan amount (principal).",
        "Input the annual interest rate and loan term in months/years.",
        "Click 'Calculate' to see your monthly payment.",
        "View the full amortization schedule to see each payment breakdown."
    ];

    const features = [
        { title: "Monthly Payment", description: "Instantly see your exact monthly EMI payment amount." },
        { title: "Amortization Table", description: "Full month-by-month breakdown of principal vs interest paid." },
        { title: "Total Interest", description: "See the total amount of interest you'll pay over the loan's life." },
        { title: "Multiple Loan Types", description: "Works for mortgages, car loans, personal loans, and more." }
    ];

    const faq = [
        { question: "What is an EMI?", answer: "EMI (Equated Monthly Installment) is a fixed payment amount made to a lender each month." },
        { question: "What affects my monthly payment?", answer: "The loan amount, interest rate, and repayment term are the three key factors." },
        { question: "Do I need to sign up?", answer: "No, the loan calculator is completely free and requires no account." }
    ];

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
            <LoanCalculatorClient />
            <RelatedTools currentHref="/tools/calculator/loan" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}

import { getToolByHref } from "@/lib/toolsRegistry";
import PasswordGeneratorClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/security/password-generator");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["password generator", "secure password", "random password", "password creator", "strong password", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
            images: [{ url: `https://kitbase.tech/og?name=${encodeURIComponent(tool.name)}&desc=${encodeURIComponent(tool.description)}&cat=security`, width: 1200, height: 630, alt: `${tool.name} | Kitbase` }],
        },
        alternates: {
            canonical: `https://kitbase.tech/tools/security/password-generator`,
        },
    };
}

import { getToolSchema, getBreadcrumbSchema, getHowToSchema, getFaqSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";
import RelatedTools from "@/components/global/RelatedTools";

export default function PasswordGeneratorPage() {
    const tool = getToolByHref("/tools/security/password-generator");
    const jsonLd = getToolSchema(tool);
    const breadcrumbSchema = getBreadcrumbSchema(tool);

    const steps = [
        "Set your desired password length using the slider.",
        "Toggle options: include uppercase, numbers, and symbols.",
        "Click 'Generate' to create a new random password.",
        "Copy it to your password manager immediately."
    ];

    const features = [
        { title: "Truly Random", description: "Uses cryptographically secure random generation." },
        { title: "Customizable", description: "Control length, character sets, and complexity." },
        { title: "Strength Meter", description: "Visual indicator shows how strong your password is." },
        { title: "Never Stored", description: "Generated passwords are never logged or sent anywhere." }
    ];

    const faq = [
        { question: "How long should my password be?", answer: "We recommend at least 16 characters for critical accounts." },
        { question: "Is it safe to use this tool?", answer: "Yes, all generation happens in your browser and nothing is stored." },
        { question: "Should I use symbols?", answer: "Yes, including symbols greatly increases the entropy and security of your password." }
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
            <PasswordGeneratorClient />
            <RelatedTools currentHref="/tools/security/password-generator" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}

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
        },
    };
}

import { getToolSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";

export default function PasswordGeneratorPage() {
    const tool = getToolByHref("/tools/security/password-generator");
    const jsonLd = getToolSchema(tool);

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

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PasswordGeneratorClient />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}

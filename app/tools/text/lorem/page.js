import { getToolByHref } from "@/lib/toolsRegistry";
import LoremIpsumClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/text/lorem");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["lorem ipsum generator", "dummy text", "placeholder text", "generate lorem ipsum", "dummy content", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";

export default function LoremIpsumPage() {
    const tool = getToolByHref("/tools/text/lorem");
    const jsonLd = getToolSchema(tool);

    const steps = [
        "Select the number of paragraphs, sentences, or words you need.",
        "Choose whether to start with 'Lorem ipsum dolor sit amet'.",
        "Click 'Generate' to create the placeholder text.",
        "Copy to clipboard for use in your designs."
    ];

    const features = [
        { title: "Custom Length", description: "Generate exactly the amount of text you need." },
        { title: "HTML Tags", description: "Optionally wrap text in <p> tags for web development." },
        { title: "Classic Latin", description: "Uses the standard Cicero text used by designers for centuries." },
        { title: "Instant Copy", description: "One-click copy button speeds up your workflow." }
    ];

    const faq = [
        { question: "What is Lorem Ipsum?", answer: "It's standard dummy text used in printing and design to demonstrate layout." },
        { question: "Is it real Latin?", answer: "It has roots in classical Latin literature from 45 BC, but is altered to be nonsensical." },
        { question: "Why do we use it?", answer: "It has a more-or-less normal distribution of letters, making it look like readable English." }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <LoremIpsumClient />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}

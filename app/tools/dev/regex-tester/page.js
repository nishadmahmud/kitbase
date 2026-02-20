import { getToolByHref } from "@/lib/toolsRegistry";
import RegexTesterClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/dev/regex-tester");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["regex tester", "regular expression tester", "regex debugger", "javascript regex", "regex playground", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";

export default function RegexTesterPage() {
    const tool = getToolByHref("/tools/dev/regex-tester");
    const jsonLd = getToolSchema(tool);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <RegexTesterClient />
        </>
    );
}

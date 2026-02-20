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

export default function RegexTesterPage() {
    return <RegexTesterClient />;
}

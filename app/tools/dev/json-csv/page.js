import { getToolByHref } from "@/lib/toolsRegistry";
import JsonCsvConverterClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/dev/json-csv");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["json to csv", "csv to json", "data converter", "json converter", "csv converter", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";

export default function JsonCsvConverterPage() {
    const tool = getToolByHref("/tools/dev/json-csv");
    const jsonLd = getToolSchema(tool);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <JsonCsvConverterClient />
        </>
    );
}

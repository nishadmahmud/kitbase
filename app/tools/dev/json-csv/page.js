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

export default function JsonCsvConverterPage() {
    return <JsonCsvConverterClient />;
}

import { getToolByHref } from "@/lib/toolsRegistry";
import SqlFormatterClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/dev/sql-formatter");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["sql formatter", "sql beautifier", "format sql", "sql query formatter", "database tools", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

export default function SqlFormatterPage() {
    return <SqlFormatterClient />;
}

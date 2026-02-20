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

import { getToolSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";

export default function SqlFormatterPage() {
    const tool = getToolByHref("/tools/dev/sql-formatter");
    const jsonLd = getToolSchema(tool);

    const steps = [
        "Paste your messy or one-line SQL query into the editor.",
        "Select your SQL dialect (Standard, PostgreSQL, MySQL, etc.) if needed.",
        "Click format to instantly beautify the query.",
        "Copy the clean, readable SQL code."
    ];

    const features = [
        { title: "Multi-dialect Support", description: "Works with Standard SQL, PostgreSQL, MySQL, MariaDB, and more." },
        { title: "Keyword Uppercasing", description: "Automatically capitalizes SQL keywords for better readability." },
        { title: "Indentation Control", description: "Properly indents nested queries and clauses." },
        { title: "Error Highlighting", description: "Identifies basic syntax errors in your SQL structure." }
    ];

    const faq = [
        { question: "Does it execute the SQL?", answer: "No, it only formats the text. It does not connect to any database." },
        { question: "Is my query private?", answer: "Yes, distinct from other tools, your queries are processed locally in your browser." },
        { question: "Can it minify SQL?", answer: "Currently it focuses on beautifying, but minification features are coming soon." }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <SqlFormatterClient />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}

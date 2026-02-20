import AllToolsClient from "./AllToolsClient";

export const metadata = {
    title: "All Tools | Kitbase - Free Online Utilities",
    description:
        "Browse the complete collection of free online tools on Kitbase. PDF editors, image utilities, developer tools, text processors, calculators, and more — all in one place.",
    keywords: [
        "all online tools", "free tools list", "pdf tools", "image tools",
        "developer utilities", "text tools", "calculators", "productivity tools",
        "kitbase tools", "free web utilities",
    ],
    alternates: {
        canonical: "https://kitbase.tech/all-tools",
    },
    openGraph: {
        title: "All Tools | Kitbase",
        description:
            "49+ free browser-based tools for PDF, images, text, developer tasks, and more. No signup, no ads.",
        type: "website",
        url: "https://kitbase.tech/all-tools",
    },
};

export default function AllToolsPage() {
    return <AllToolsClient />;
}

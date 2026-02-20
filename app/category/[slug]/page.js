import { categories } from "@/lib/toolsRegistry";
import CategoryClient from "./client";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const category = categories.find((c) => c.slug === slug);

    if (!category) {
        return {
            title: "Category Not Found | Kitbase",
            description: "The requested tool category could not be found.",
        };
    }

    return {
        title: `${category.name} | Kitbase - Free Online Tools`,
        description: category.description,
        keywords: [...category.tags, "online tools", "free utilities", "kitbase"],
        alternates: {
            canonical: `https://kitbase.tech/category/${slug}`,
        },
        openGraph: {
            title: `${category.name} | Kitbase`,
            description: category.description,
            type: "website",
            url: `https://kitbase.tech/category/${slug}`,
            images: [{
                url: `https://kitbase.tech/og?name=${encodeURIComponent(category.name)}&desc=${encodeURIComponent(category.description)}&cat=${slug}`,
                width: 1200,
                height: 630,
                alt: `${category.name} | Kitbase`,
            }],
        },
    };
}

export default function CategoryPage() {
    return <CategoryClient />;
}

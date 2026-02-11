import { tools, categories } from "@/lib/toolsRegistry";

export default function sitemap() {
    const baseUrl = "https://kitbase.tech";

    // Base routes
    const routes = [
        "",
        "/all-tools",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: route === "" ? 1.0 : 0.9,
    }));

    // Category routes
    const categoryRoutes = categories.map((category) => ({
        url: `${baseUrl}/category/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
    }));

    // Tool routes
    const toolRoutes = tools.map((tool) => ({
        url: `${baseUrl}${tool.href}`, // tool.href already includes /tools/...
        lastModified: new Date(),
        changeFrequency: "daily", // Tools are the core content
        priority: 0.9,
    }));

    return [...routes, ...categoryRoutes, ...toolRoutes];
}

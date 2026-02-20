import { tools, categories } from "@/lib/toolsRegistry";

export default function sitemap() {
    const baseUrl = "https://kitbase.tech";
    const now = new Date().toISOString();

    // Base routes
    const routes = [
        { path: "", priority: 1.0, freq: "daily" },
        { path: "/all-tools", priority: 0.9, freq: "weekly" },
    ].map(({ path, priority, freq }) => ({
        url: `${baseUrl}${path}`,
        lastModified: now,
        changeFrequency: freq,
        priority,
    }));

    // Category routes
    const categoryRoutes = categories.map((category) => ({
        url: `${baseUrl}/category/${category.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
    }));

    // Tool routes — highest priority, most link equity
    const toolRoutes = tools.map((tool) => ({
        url: `${baseUrl}${tool.href}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: tool.popular ? 0.95 : 0.85,
        // Popular tools get slightly higher priority
    }));

    return [...routes, ...categoryRoutes, ...toolRoutes];
}


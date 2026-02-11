export default function robots() {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: "/private/", // Example, though we don't have private yet
        },
        sitemap: "https://kitbase.tech/sitemap.xml",
    };
}

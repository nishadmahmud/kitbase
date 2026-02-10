import {
    FileText,
    Scissors,
    ArrowUpDown,
    Archive,
    Image,
    Shrink,
    RefreshCw,
    Eye,
    FileDown,
    Braces,
    Binary,
    GraduationCap,
    Percent,
} from "lucide-react";

export const categories = [
    {
        slug: "pdf",
        name: "PDF Tools",
        description: "Edit, convert, and manage PDF files easily with our suite of powerful document tools.",
        icon: FileText,
        color: "#4f8cff",
        tags: ["Merge", "Split", "Compress", "Convert"],
    },
    {
        slug: "image",
        name: "Image Tools",
        description: "Resize, compress, and convert images with browser-based processing.",
        icon: Image,
        color: "#a78bfa",
        tags: ["Resize", "Crop", "Filters", "Conversion"],
    },
    {
        slug: "dev",
        name: "Text & Dev Tools",
        description: "Developer utilities for formatting, encoding, and text processing.",
        icon: Braces,
        color: "#34d399",
        tags: ["JSON", "Markdown", "Base64", "Diff"],
    },
    {
        slug: "calculator",
        name: "Calculators",
        description: "Quick calculation tools for everyday academic and professional needs.",
        icon: GraduationCap,
        color: "#fbbf24",
        tags: ["Unit", "Currency", "Percentage", "Math"],
    },
];

export const tools = [
    // PDF Tools
    {
        name: "Merge PDF",
        slug: "merge",
        category: "pdf",
        description: "Combine multiple PDF files into a single document with ease and speed.",
        icon: FileText,
        href: "/tools/pdf/merge",
        popular: true,
    },
    {
        name: "Split PDF",
        slug: "split",
        category: "pdf",
        description: "Separate one page or a whole set for easy conversion and organization.",
        icon: Scissors,
        href: "/tools/pdf/split",
    },
    {
        name: "Reorder PDF",
        slug: "reorder",
        category: "pdf",
        description: "Rearrange pages in your PDF document by dragging them into the right order.",
        icon: ArrowUpDown,
        href: "/tools/pdf/reorder",
    },
    {
        name: "Compress PDF",
        slug: "compress",
        category: "pdf",
        description: "Reduce the file size of your PDF without losing original document quality.",
        icon: Archive,
        href: "/tools/pdf/compress",
    },
    // Image Tools
    {
        name: "Resize Image",
        slug: "resize",
        category: "image",
        description: "Change image dimensions while maintaining quality and aspect ratio.",
        icon: Image,
        href: "/tools/image/resize",
        popular: true,
    },
    {
        name: "Compress Image",
        slug: "compress",
        category: "image",
        description: "Reduce file size of JPG, PNG, and WebP without losing quality.",
        icon: Shrink,
        href: "/tools/image/compress",
        popular: true,
    },
    {
        name: "Convert Image",
        slug: "convert",
        category: "image",
        description: "Convert images between JPG, PNG, WebP, and other formats instantly.",
        icon: RefreshCw,
        href: "/tools/image/convert",
    },
    // Markdown Tools (under dev category)
    {
        name: "Markdown Viewer",
        slug: "viewer",
        category: "dev",
        description: "Live preview and edit your markdown files with real-time rendering.",
        icon: Eye,
        href: "/tools/markdown/viewer",
        popular: true,
    },
    {
        name: "Markdown to PDF",
        slug: "to-pdf",
        category: "dev",
        description: "Export your markdown documents to beautifully formatted PDF files.",
        icon: FileDown,
        href: "/tools/markdown/to-pdf",
    },
    // Dev Tools
    {
        name: "JSON Formatter",
        slug: "json-formatter",
        category: "dev",
        description: "Prettify and validate complex JSON data for better readability.",
        icon: Braces,
        href: "/tools/dev/json-formatter",
        popular: true,
    },
    {
        name: "Base64 Encoder",
        slug: "base64",
        category: "dev",
        description: "Encode and decode Base64 strings quickly in your browser.",
        icon: Binary,
        href: "/tools/dev/base64",
    },
    // Calculators
    {
        name: "GPA Calculator",
        slug: "gpa",
        category: "calculator",
        description: "Calculate your GPA instantly with our easy-to-use grade calculator.",
        icon: GraduationCap,
        href: "/tools/calculator/gpa",
    },
    {
        name: "Percentage Calculator",
        slug: "percentage",
        category: "calculator",
        description: "Quick percentage calculations for discounts, tips, grades, and more.",
        icon: Percent,
        href: "/tools/calculator/percentage",
    },
];

export function getToolsByCategory(categorySlug) {
    return tools.filter((tool) => tool.category === categorySlug);
}

export function getCategoryBySlug(slug) {
    return categories.find((cat) => cat.slug === slug);
}

export function getPopularTools() {
    return tools.filter((tool) => tool.popular);
}

export function searchTools(query) {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return tools.filter(
        (tool) =>
            tool.name.toLowerCase().includes(q) ||
            tool.description.toLowerCase().includes(q) ||
            tool.category.toLowerCase().includes(q)
    );
}

export function getToolByHref(href) {
    return tools.find((tool) => tool.href === href);
}

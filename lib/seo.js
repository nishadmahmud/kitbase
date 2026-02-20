const BASE_URL = "https://kitbase.tech";

/** Existing: SoftwareApplication schema */
export function getToolSchema(tool) {
    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": tool.name,
        "description": tool.description,
        "url": `${BASE_URL}${tool.href}`,
        "applicationCategory": getSchemaCategory(tool.category),
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "1250",
        },
    };
}

/**
 * BreadcrumbList schema — shows "Kitbase > PDF Tools > Merge PDF" in search results.
 * Pass the full tool object from toolsRegistry.
 */
export function getBreadcrumbSchema(tool) {
    const categoryNames = {
        pdf: "PDF Tools", image: "Image Tools", dev: "Developer Tools",
        calculator: "Calculators", text: "Text Tools", design: "Design Tools",
        security: "Security Tools", productivity: "Productivity Tools",
        file: "File Tools", visualization: "Visualization Tools", markdown: "Developer Tools",
    };
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem", "position": 1,
                "name": "Kitbase", "item": BASE_URL,
            },
            {
                "@type": "ListItem", "position": 2,
                "name": categoryNames[tool.category] ?? tool.category,
                "item": `${BASE_URL}/category/${tool.category}`,
            },
            {
                "@type": "ListItem", "position": 3,
                "name": tool.name, "item": `${BASE_URL}${tool.href}`,
            },
        ],
    };
}

/**
 * HowTo schema — Google can display numbered steps directly in the search snippet.
 * @param {object} tool  - tool object from registry
 * @param {string[]} steps - array of step strings from the page
 */
export function getHowToSchema(tool, steps) {
    return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": `How to use ${tool.name}`,
        "description": tool.description,
        "step": steps.map((text, i) => ({
            "@type": "HowToStep",
            "position": i + 1,
            "name": `Step ${i + 1}`,
            "text": text,
        })),
    };
}

/**
 * FAQPage schema — Google shows accordion FAQ directly in results (huge CTR boost).
 * @param {{ question: string, answer: string }[]} faq
 */
export function getFaqSchema(faq) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faq.map(({ question, answer }) => ({
            "@type": "Question",
            "name": question,
            "acceptedAnswer": { "@type": "Answer", "text": answer },
        })),
    };
}

function getSchemaCategory(categorySlug) {
    const map = {
        pdf: "BusinessApplication",
        image: "MultimediaApplication",
        dev: "DeveloperApplication",
        calculator: "EducationalApplication",
        text: "UtilitiesApplication",
        design: "DesignApplication",
        security: "SecurityApplication",
        productivity: "ProductivityApplication",
        file: "UtilitiesApplication",
        visualization: "BusinessApplication",
    };
    return map[categorySlug] || "Application";
}


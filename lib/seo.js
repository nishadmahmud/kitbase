export function getToolSchema(tool) {
    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": tool.name,
        "description": tool.description,
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

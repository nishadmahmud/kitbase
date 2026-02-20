import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getToolsByCategory, getToolByHref, getCategoryBySlug } from "@/lib/toolsRegistry";

export default function RelatedTools({ currentHref }) {
    const currentTool = getToolByHref(currentHref);
    if (!currentTool) return null;

    const siblings = getToolsByCategory(currentTool.category)
        .filter((t) => t.href !== currentHref)
        .slice(0, 4);

    if (siblings.length === 0) return null;

    const category = getCategoryBySlug(currentTool.category);

    return (
        <section className="py-16 sm:py-20 border-t border-gray-100 dark:border-gray-800/60">
            <div className="max-w-5xl mx-auto px-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-widest mb-1"
                            style={{ color: category?.color ?? "#6366f1" }}>
                            {category?.name ?? "Related"}
                        </p>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                            You might also like
                        </h2>
                    </div>
                    <Link
                        href={`/tools#${currentTool.category}`}
                        className="hidden sm:flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                        See all {category?.name}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Cards grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {siblings.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <Link
                                key={tool.href}
                                href={tool.href}
                                className="group relative flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg transition-all duration-200"
                            >
                                {/* Icon bubble */}
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-200"
                                    style={{ backgroundColor: `${category?.color ?? "#6366f1"}18` }}
                                >
                                    {Icon && (
                                        <Icon
                                            className="w-5 h-5"
                                            style={{ color: category?.color ?? "#6366f1" }}
                                        />
                                    )}
                                </div>

                                {/* Text */}
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {tool.name}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex-1">
                                    {tool.description}
                                </p>

                                {/* Arrow */}
                                <div className="mt-4 flex items-center gap-1 text-xs font-medium"
                                    style={{ color: category?.color ?? "#6366f1" }}>
                                    Try it free
                                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Mobile "see all" link */}
                <div className="mt-8 sm:hidden text-center">
                    <Link
                        href={`/tools#${currentTool.category}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                        See all {category?.name} <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

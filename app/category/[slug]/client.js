"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { categories, getToolsByCategory } from "@/lib/toolsRegistry";

export default function CategoryClient() {
    const { slug } = useParams();
    const category = categories.find((c) => c.slug === slug);

    if (!category) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-12 text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">Category not found</h1>
                <Link href="/all-tools" className="text-gray-500 dark:text-gray-400 no-underline mt-4 inline-block hover:text-gray-900 dark:hover:text-gray-300">Browse all tools</Link>
            </div>
        );
    }

    const tools = getToolsByCategory(slug);
    const Icon = category.icon;

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <nav className="text-sm text-gray-500 mb-6 flex items-center">
                <Link href="/" className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 transition-colors no-underline">Home</Link>
                <span className="mx-2">›</span>
                <Link href="/all-tools" className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 transition-colors no-underline">All Tools</Link>
                <span className="mx-2">›</span>
                <span className="text-gray-900 dark:text-gray-200 font-medium">{category.name}</span>
            </nav>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[20px] p-9 mb-12 shadow-sm">
                <div className="flex items-center gap-6">
                    <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                        style={{ color: category.color }}
                    >
                        <Icon className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-200 m-0">{category.name}</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1.5 mb-0 text-[15px]">
                            {tools.length} tools available · {category.tags.join(", ")}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 sm:gap-5">
                {tools.map((tool) => {
                    const ToolIcon = tool.icon;
                    return (
                        <Link
                            key={tool.href}
                            href={tool.href}
                            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-7 no-underline transition-all hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md hover:shadow-gray-200/50 dark:hover:shadow-black/20 group"
                        >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-blue-50 dark:group-hover:bg-gray-700 group-hover:border-blue-100 dark:group-hover:border-gray-600 transition-colors">
                                <ToolIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-200 m-0 mb-1 sm:mb-2 text-sm sm:text-base group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{tool.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed m-0 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors line-clamp-2 sm:line-clamp-none">{tool.description}</p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

"use client";

import Link from "next/link";
import { categories, tools as allTools } from "@/lib/toolsRegistry";

export default function AllToolsPage() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="mb-12">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-200 m-0">All Tools</h1>
                <p className="mt-2 mb-0 text-gray-600 dark:text-gray-400 text-base">Browse every tool available on Kitbase.</p>
            </div>

            <div className="flex flex-col gap-14">
                {categories.map((cat) => {
                    const Icon = cat.icon;
                    const tools = allTools.filter((t) => t.category === cat.slug);
                    return (
                        <div key={cat.slug}>
                            <div className="flex items-center gap-3.5 mb-6">
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
                                    style={{ color: cat.color }}
                                >
                                    <Icon className="w-[22px] h-[22px]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-200 m-0">{cat.name}</h2>
                                    <p className="text-[13px] text-gray-500 dark:text-gray-400 m-0">{tools.length} tools</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 sm:gap-4">
                                {tools.map((tool) => {
                                    const ToolIcon = tool.icon;
                                    return (
                                        <Link
                                            key={tool.href}
                                            href={tool.href}
                                            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[14px] px-4 py-4 sm:px-6 sm:py-5 no-underline transition-all hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md hover:shadow-gray-200/50 dark:hover:shadow-black/20 group h-full"
                                        >
                                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[10px] bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50 dark:group-hover:bg-gray-700 group-hover:border-blue-100 dark:group-hover:border-gray-600 transition-colors">
                                                <ToolIcon className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-gray-600 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-white transition-colors" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-gray-900 dark:text-gray-200 text-sm sm:text-[15px] m-0 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{tool.name}</h3>
                                                <p className="text-xs sm:text-[13px] text-gray-500 dark:text-gray-400 m-0 line-clamp-2 sm:line-clamp-none group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">{tool.description}</p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

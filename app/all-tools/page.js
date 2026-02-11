"use client";

import Link from "next/link";
import { categories, tools as allTools } from "@/lib/toolsRegistry";

export default function AllToolsPage() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="mb-12">
                <h1 className="text-3xl font-extrabold text-gray-200 m-0">All Tools</h1>
                <p className="mt-2 mb-0 text-gray-400 text-base">Browse every tool available on Kitbase.</p>
            </div>

            <div className="flex flex-col gap-14">
                {categories.map((cat) => {
                    const Icon = cat.icon;
                    const tools = allTools.filter((t) => t.category === cat.slug);
                    return (
                        <div key={cat.slug}>
                            <div className="flex items-center gap-3.5 mb-6">
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-gray-800"
                                >
                                    <Icon className="w-[22px] h-[22px] text-gray-200" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-200 m-0">{cat.name}</h2>
                                    <p className="text-[13px] text-gray-500 m-0">{tools.length} tools</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
                                {tools.map((tool) => {
                                    const ToolIcon = tool.icon;
                                    return (
                                        <Link
                                            key={tool.href}
                                            href={tool.href}
                                            className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-[14px] px-6 py-5 no-underline transition-all hover:bg-gray-800 hover:border-gray-700 group h-full"
                                        >
                                            <div className="w-11 h-11 rounded-[10px] bg-gray-800 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-700 transition-colors">
                                                <ToolIcon className="w-[22px] h-[22px] text-gray-200" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-gray-200 text-[15px] m-0">{tool.name}</h3>
                                                <p className="text-[13px] text-gray-500 m-0 truncate">{tool.description}</p>
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

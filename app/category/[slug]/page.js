"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { categories, getToolsByCategory } from "@/lib/toolsRegistry";

export default function CategoryPage() {
    const { slug } = useParams();
    const category = categories.find((c) => c.slug === slug);

    if (!category) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-12 text-center">
                <h1 className="text-2xl font-bold text-gray-200">Category not found</h1>
                <Link href="/all-tools" className="text-blue-500 no-underline mt-4 inline-block hover:text-blue-400">Browse all tools</Link>
            </div>
        );
    }

    const tools = getToolsByCategory(slug);
    const Icon = category.icon;

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <nav className="text-sm text-gray-500 mb-6 flex items-center">
                <Link href="/" className="text-gray-500 hover:text-gray-300 transition-colors no-underline">Home</Link>
                <span className="mx-2">›</span>
                <Link href="/all-tools" className="text-gray-500 hover:text-gray-300 transition-colors no-underline">All Tools</Link>
                <span className="mx-2">›</span>
                <span className="text-blue-500 font-medium">{category.name}</span>
            </nav>

            <div className="bg-[#171a21] border border-gray-800 rounded-[20px] p-9 mb-12">
                <div className="flex items-center gap-6">
                    <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${category.color}15` }}
                    >
                        <Icon className="w-8 h-8" style={{ color: category.color }} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-200 m-0">{category.name}</h1>
                        <p className="text-gray-400 mt-1.5 mb-0 text-[15px]">
                            {tools.length} tools available · {category.tags.join(", ")}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
                {tools.map((tool) => {
                    const ToolIcon = tool.icon;
                    return (
                        <Link
                            key={tool.href}
                            href={tool.href}
                            className="bg-[#171a21] border border-gray-800 rounded-2xl p-7 no-underline transition-all hover:bg-[#1e2230] hover:border-gray-700 group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                                <ToolIcon className="w-6 h-6 text-blue-500" />
                            </div>
                            <h3 className="font-semibold text-gray-200 m-0 mb-2 text-base">{tool.name}</h3>
                            <p className="text-sm text-gray-400 leading-relaxed m-0">{tool.description}</p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

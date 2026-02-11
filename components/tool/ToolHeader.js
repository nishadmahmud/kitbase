"use client";

import Link from "next/link";
import { ChevronRight, Shield, Home } from "lucide-react";
import { usePathname } from "next/navigation";
import { tools, categories } from "@/lib/toolsRegistry";

export default function ToolHeader({ title, description, breadcrumbs = [] }) {
    const pathname = usePathname();

    // Auto-generate breadcrumbs if not provided
    if (breadcrumbs.length === 0 && pathname) {
        // Try to match current path to a tool
        const currentTool = tools.find(t => t.href === pathname);

        if (currentTool) {
            const category = categories.find(c => c.slug === currentTool.category);
            if (category) {
                breadcrumbs = [
                    { label: category.name, href: `/category/${category.slug}` },
                    { label: currentTool.name, href: null } // Current page
                ];
            }
        }
    }

    // Ensure "Tools" is the parent of Category
    if (breadcrumbs.length > 0 && breadcrumbs[0].label !== "Tools") {
        breadcrumbs = [{ label: "Tools", href: "/all-tools" }, ...breadcrumbs];
    }

    return (
        <div className="mb-10">
            <nav className="flex items-center gap-1.5 text-sm mb-4 text-gray-500 dark:text-gray-500 overflow-x-auto no-scrollbar whitespace-nowrap">
                <Link href="/" className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors no-underline flex items-center gap-1">
                    <Home size={14} />
                    <span className="hidden sm:inline">Home</span>
                </Link>

                {breadcrumbs.map((crumb, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600 block flex-shrink-0" />
                        {crumb.href ? (
                            <Link href={crumb.href} className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors no-underline">
                                {crumb.label}
                            </Link>
                        ) : (
                            <span className="text-gray-900 dark:text-gray-200 font-medium">{crumb.label}</span>
                        )}
                    </span>
                ))}
            </nav>

            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 tracking-tight leading-tight">{title}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed max-w-3xl">{description}</p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                <Shield className="w-3.5 h-3.5" />
                <span>Client-side only. Data never leaves your device.</span>
            </div>
        </div>
    );
}

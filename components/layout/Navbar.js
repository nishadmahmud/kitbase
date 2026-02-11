"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Search, X, Sun, Moon } from "lucide-react";
import { searchTools, categories, getToolsByCategory } from "@/lib/toolsRegistry";

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const searchRef = useRef(null);
    const pathname = usePathname();

    useEffect(() => {
        if (searchQuery.trim()) {
            setSearchResults(searchTools(searchQuery));
            setShowSearch(true);
        } else {
            setSearchResults([]);
            setShowSearch(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        setSearchQuery("");
        setShowSearch(false);
        setHoveredCategory(null);
    }, [pathname]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSearch(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Global Search Shortcut (Ctrl/Cmd + K)
    useEffect(() => {
        function handleKeyDown(e) {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                const input = searchRef.current?.querySelector("input");
                if (input) {
                    input.focus();
                    setShowSearch(true);
                }
            }
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const navLinks = [
        { label: "Tools", href: "/all-tools" },
        ...categories.slice(0, 3).map((c) => ({
            label: c.name.replace(" Tools", ""),
            href: `/category/${c.slug}`,
            slug: c.slug,
            isCategory: true,
        })),
    ];

    return (
        <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/85 backdrop-blur-xl transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex h-16 items-center justify-between gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 no-underline flex-shrink-0 group">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg overflow-hidden group-hover:scale-105 transition-transform">
                            <Image src="/logo.svg" alt="Kitbase Logo" width={32} height={32} className="w-full h-full object-contain dark:invert" />
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Kitbase</span>
                    </Link>

                    {/* Nav links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <div
                                key={link.href}
                                className="relative"
                                onMouseEnter={() => link.isCategory && setHoveredCategory(link.slug)}
                                onMouseLeave={() => setHoveredCategory(null)}
                            >
                                <Link
                                    href={link.href}
                                    className={`block px-3.5 py-2 text-sm rounded-lg no-underline transition-all duration-200 ${pathname === link.href || hoveredCategory === link.slug
                                        ? "text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-500/10"
                                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                                        }`}
                                >
                                    {link.label}
                                </Link>

                                {/* Dropdown */}
                                {link.isCategory && hoveredCategory === link.slug && (
                                    <div
                                        className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white dark:bg-[#171a21] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl shadow-black/10 dark:shadow-black/50 p-2 z-[100]"
                                        style={{
                                            width: getToolsByCategory(link.slug).length > 5
                                                ? `${Math.ceil(getToolsByCategory(link.slug).length / 5) * 280}px`
                                                : "280px"
                                        }}
                                    >
                                        <div className="grid grid-flow-col grid-rows-5 gap-x-2">
                                            {getToolsByCategory(link.slug).map((tool) => {
                                                const Icon = tool.icon;
                                                return (
                                                    <Link
                                                        key={tool.href}
                                                        href={tool.href}
                                                        className="flex items-center gap-3 p-2.5 rounded-lg no-underline transition-colors hover:bg-gray-50 dark:hover:bg-[#1e2230] group w-[264px]"
                                                    >
                                                        <div className="flex items-center justify-center w-8 h-8 bg-blue-500/10 rounded-lg flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                                                            <Icon className="w-4 h-4 text-blue-500" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">{tool.name}</div>
                                                            <div className="text-xs text-gray-500 leading-tight mt-0.5 truncate">
                                                                {tool.description}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <div ref={searchRef} className="relative hidden sm:block">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Quick search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => searchQuery.trim() && setShowSearch(true)}
                                    className="w-60 pl-9 pr-8 py-2 text-sm bg-gray-100 dark:bg-[#1a1e27] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-gray-200 outline-none focus:border-blue-500/50 focus:bg-white dark:focus:bg-[#1a1e27] transition-all"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {showSearch && (
                                <div className="absolute top-full mt-2 right-0 w-80 bg-white dark:bg-[#171a21] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl shadow-black/10 dark:shadow-black/50 overflow-hidden z-[100]">
                                    {searchResults.length > 0 ? (
                                        <div className="py-2">
                                            {searchResults.slice(0, 6).map((tool) => {
                                                const Icon = tool.icon;
                                                return (
                                                    <Link
                                                        key={tool.href}
                                                        href={tool.href}
                                                        onClick={() => setShowSearch(false)}
                                                        className="flex items-center gap-3 px-4 py-2.5 no-underline transition-colors hover:bg-gray-50 dark:hover:bg-[#1e2230] group"
                                                    >
                                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                                                            <Icon className="w-4 h-4 text-blue-500" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-200 m-0">{tool.name}</p>
                                                            <p className="text-xs text-gray-500 m-0">{tool.category}</p>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="py-6 px-4 text-center text-sm text-gray-500">
                                            No tools found for &quot;{searchQuery}&quot;
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Theme Toggle */}
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </nav>
    );
}

function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="w-9 h-9" />; // Placeholder to avoid hydration mismatch

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 transition-colors border-none bg-transparent cursor-pointer"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
    );
}

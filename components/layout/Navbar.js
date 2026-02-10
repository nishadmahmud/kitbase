"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, X, LayoutGrid, Menu } from "lucide-react";
import { searchTools, categories, getToolsByCategory } from "@/lib/toolsRegistry";

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
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
        setMobileMenu(false);
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
        <nav style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid #2a2f3a", backgroundColor: "rgba(15,17,21,0.85)", backdropFilter: "blur(20px)" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
                <div style={{ display: "flex", height: "64px", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                    {/* Logo */}
                    <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", flexShrink: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", backgroundColor: "#4f8cff", borderRadius: "8px" }}>
                            <LayoutGrid style={{ width: "16px", height: "16px", color: "white" }} />
                        </div>
                        <span style={{ fontSize: "18px", fontWeight: 700, color: "#e6e8ee" }}>Kitbase</span>
                    </Link>

                    {/* Nav links */}
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }} className="hidden md:flex">
                        {navLinks.map((link) => (
                            <div
                                key={link.href}
                                style={{ position: "relative" }}
                                onMouseEnter={() => link.isCategory && setHoveredCategory(link.slug)}
                                onMouseLeave={() => setHoveredCategory(null)}
                            >
                                <Link
                                    href={link.href}
                                    style={{
                                        display: "block",
                                        padding: "8px 14px",
                                        fontSize: "14px",
                                        borderRadius: "8px",
                                        textDecoration: "none",
                                        transition: "all 0.2s",
                                        color: pathname === link.href || hoveredCategory === link.slug ? "#4f8cff" : "#9aa0aa",
                                        backgroundColor: pathname === link.href || hoveredCategory === link.slug ? "rgba(79,140,255,0.1)" : "transparent",
                                    }}
                                >
                                    {link.label}
                                </Link>

                                {/* Dropdown */}
                                {link.isCategory && hoveredCategory === link.slug && (
                                    <div style={{
                                        position: "absolute",
                                        top: "100%",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        marginTop: "4px",
                                        width: "280px",
                                        backgroundColor: "#171a21",
                                        border: "1px solid #2a2f3a",
                                        borderRadius: "12px",
                                        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                                        padding: "8px",
                                        zIndex: 100,
                                    }}>
                                        {getToolsByCategory(link.slug).map((tool) => {
                                            const Icon = tool.icon;
                                            return (
                                                <Link
                                                    key={tool.href}
                                                    href={tool.href}
                                                    style={{
                                                        display: "flex", alignItems: "center", gap: "12px",
                                                        padding: "10px", borderRadius: "8px",
                                                        textDecoration: "none", transition: "background 0.2s",
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1e2230"}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                                >
                                                    <div style={{
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        width: "32px", height: "32px",
                                                        backgroundColor: "rgba(79,140,255,0.1)", borderRadius: "8px",
                                                        flexShrink: 0
                                                    }}>
                                                        <Icon style={{ width: "16px", height: "16px", color: "#4f8cff" }} />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: "14px", fontWeight: 500, color: "#e6e8ee" }}>{tool.name}</div>
                                                        <div style={{ fontSize: "12px", color: "#6b7280", lineHeight: 1.2, marginTop: "2px" }}>
                                                            {tool.description.slice(0, 40)}...
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Search */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div ref={searchRef} style={{ position: "relative" }} className="hidden sm:block">
                            <div style={{ position: "relative" }}>
                                <Search style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "#6b7280" }} />
                                <input
                                    type="text"
                                    placeholder="Quick search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => searchQuery.trim() && setShowSearch(true)}
                                    style={{
                                        width: "240px",
                                        paddingLeft: "36px",
                                        paddingRight: "32px",
                                        paddingTop: "8px",
                                        paddingBottom: "8px",
                                        fontSize: "14px",
                                        backgroundColor: "#1a1e27",
                                        border: "1px solid #2a2f3a",
                                        borderRadius: "8px",
                                        color: "#e6e8ee",
                                        outline: "none",
                                        transition: "all 0.2s",
                                    }}
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}
                                    >
                                        <X style={{ width: "16px", height: "16px" }} />
                                    </button>
                                )}
                            </div>

                            {showSearch && (
                                <div style={{
                                    position: "absolute",
                                    top: "100%",
                                    marginTop: "8px",
                                    right: 0,
                                    width: "320px",
                                    backgroundColor: "#171a21",
                                    border: "1px solid #2a2f3a",
                                    borderRadius: "12px",
                                    boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
                                    overflow: "hidden",
                                    zIndex: 100,
                                }}>
                                    {searchResults.length > 0 ? (
                                        <div style={{ padding: "8px 0" }}>
                                            {searchResults.slice(0, 6).map((tool) => {
                                                const Icon = tool.icon;
                                                return (
                                                    <Link
                                                        key={tool.href}
                                                        href={tool.href}
                                                        onClick={() => setShowSearch(false)}
                                                        style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px", textDecoration: "none", transition: "background 0.2s" }}
                                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1e2230"}
                                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                                    >
                                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "rgba(79,140,255,0.1)" }}>
                                                            <Icon style={{ width: "16px", height: "16px", color: "#4f8cff" }} />
                                                        </div>
                                                        <div>
                                                            <p style={{ fontSize: "14px", fontWeight: 500, color: "#e6e8ee", margin: 0 }}>{tool.name}</p>
                                                            <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>{tool.category}</p>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div style={{ padding: "24px 16px", textAlign: "center", fontSize: "14px", color: "#6b7280" }}>
                                            No tools found for &quot;{searchQuery}&quot;
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setMobileMenu(!mobileMenu)}
                            className="md:hidden"
                            style={{ padding: "8px", color: "#9aa0aa", background: "none", border: "none", cursor: "pointer", borderRadius: "8px" }}
                        >
                            {mobileMenu ? <X style={{ width: "20px", height: "20px" }} /> : <Menu style={{ width: "20px", height: "20px" }} />}
                        </button>
                    </div>
                </div>

                {mobileMenu && (
                    <div className="md:hidden" style={{ paddingBottom: "16px", borderTop: "1px solid #2a2f3a", paddingTop: "16px", marginTop: "8px" }}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                style={{
                                    display: "block",
                                    padding: "10px 12px",
                                    fontSize: "14px",
                                    borderRadius: "8px",
                                    textDecoration: "none",
                                    color: pathname === link.href ? "#4f8cff" : "#9aa0aa",
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}

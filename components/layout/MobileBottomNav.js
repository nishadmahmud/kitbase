"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, FileText, Image as ImageIcon, Code2, Type } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function MobileBottomNav() {
    const pathname = usePathname();

    const navItems = [
        {
            label: "Tools",
            href: "/all-tools",
            icon: LayoutGrid,
            isActive: (path) => path === "/all-tools" || path === "/"
        },
        {
            label: "PDF",
            href: "/category/pdf",
            icon: FileText,
            isActive: (path) => path.includes("/pdf")
        },
        {
            label: "Image",
            href: "/category/image",
            icon: ImageIcon,
            isActive: (path) => path.includes("/image")
        },
        {
            label: "Dev",
            href: "/category/dev",
            icon: Code2,
            isActive: (path) => path.includes("/dev")
        },
        {
            label: "Text",
            href: "/category/text",
            icon: Type,
            isActive: (path) => path.includes("/text")
        }
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 pb-[env(safe-area-inset-bottom)]">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = item.isActive(pathname);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors no-underline",
                                active
                                    ? "text-blue-600 dark:text-blue-500"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            )}
                        >
                            <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

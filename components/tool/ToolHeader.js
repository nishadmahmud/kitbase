import Link from "next/link";
import { Shield, ChevronRight } from "lucide-react";

export default function ToolHeader({ title, description, breadcrumbs = [] }) {
    return (
        <div className="mb-8">
            {breadcrumbs.length > 0 && (
                <nav className="flex items-center gap-1.5 text-sm mb-4">
                    <Link href="/" className="text-gray-500 hover:text-gray-300 transition-colors no-underline">Home</Link>
                    {breadcrumbs.map((crumb, i) => (
                        <span key={i} className="flex items-center gap-1.5">
                            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                            {crumb.href ? (
                                <Link href={crumb.href} className="text-gray-500 hover:text-gray-300 transition-colors no-underline">{crumb.label}</Link>
                            ) : (
                                <span className="text-blue-500 font-medium">{crumb.label}</span>
                            )}
                        </span>
                    ))}
                </nav>
            )}
            <h1 className="text-3xl font-extrabold text-gray-100 mb-2">{title}</h1>
            <p className="text-[15px] text-gray-400 mb-3 leading-relaxed">{description}</p>
            <p className="inline-flex items-center gap-1.5 text-[13px] text-emerald-400 m-0 font-medium">
                <Shield className="w-3.5 h-3.5" />
                Files are processed locally. Nothing leaves your browser.
            </p>
        </div>
    );
}

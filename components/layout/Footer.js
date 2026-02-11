import Link from "next/link";
import { LayoutGrid, Shield } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-gray-800 bg-[#0f1115] mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-wrap justify-between gap-8">
                    <div>
                        <Link href="/" className="flex items-center gap-2.5 no-underline mb-3 group">
                            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg group-hover:scale-105 transition-transform">
                                <LayoutGrid className="w-4 h-4 text-gray-900" />
                            </div>
                            <span className="text-lg font-bold text-gray-100">Kitbase</span>
                        </Link>
                        <p className="flex items-center gap-1.5 text-sm text-gray-400 m-0">
                            <Shield className="w-3.5 h-3.5 text-emerald-400" />
                            Privacy-first. Files stay on your device.
                        </p>
                    </div>
                    <div className="flex gap-16">
                        <div>
                            <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3 mt-0">Platform</h4>
                            <ul className="list-none p-0 m-0 flex flex-col gap-2">
                                <li><Link href="/about" className="text-sm text-gray-400 hover:text-gray-200 transition-colors no-underline">About</Link></li>
                                <li><Link href="/all-tools" className="text-sm text-gray-400 hover:text-gray-200 transition-colors no-underline">All Tools</Link></li>
                                <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-gray-200 transition-colors no-underline">GitHub</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3 mt-0">Legal</h4>
                            <ul className="list-none p-0 m-0 flex flex-col gap-2">
                                <li><Link href="/about" className="text-sm text-gray-400 hover:text-gray-200 transition-colors no-underline">Privacy</Link></li>
                                <li><Link href="/about" className="text-sm text-gray-400 hover:text-gray-200 transition-colors no-underline">Terms</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="mt-10 pt-6 border-t border-gray-800 flex flex-wrap justify-between items-center gap-2">
                    <p className="text-xs text-gray-500 m-0">© 2025 Kitbase. Open source productivity.</p>
                    <p className="text-xs text-gray-500 m-0">v1.0.0 · Status: Operational</p>
                </div>
            </div>
        </footer>
    );
}

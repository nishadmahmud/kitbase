"use client";

import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { getPopularTools, categories } from "@/lib/toolsRegistry";

export default function HomePage() {
  const popularTools = getPopularTools();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.03)_0%,transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24">
          <div className="flex flex-wrap items-center justify-between gap-16">
            <div className="max-w-xl">
              <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold leading-[1.1] tracking-tight text-gray-100 m-0">
                All your everyday tools.{" "}
                <span className="text-gray-400">One clean place.</span>
              </h1>
              <p className="mt-6 text-lg text-gray-500 leading-relaxed m-0">
                PDF, images, text, and developer utilities — fast, private, and free. No uploads, no ads, just pure utility.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/all-tools"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-gray-100 text-gray-950 font-semibold text-[15px] rounded-xl no-underline shadow-lg shadow-gray-100/10 transition-all hover:bg-white"
                >
                  Browse Tools <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#popular"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border border-gray-800 text-gray-400 font-semibold text-[15px] rounded-xl no-underline transition-all hover:bg-gray-900 hover:text-gray-200"
                >
                  Popular Tools
                </Link>
              </div>
            </div>

            {/* Hero graphic */}
            <div className="relative w-[300px] h-[300px] flex-shrink-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-gray-800 flex items-center justify-center shadow-2xl shadow-black/50">
              <div className="grid grid-cols-3 gap-3 p-8 opacity-50">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="w-14 h-14 bg-gray-900 border border-gray-800 rounded-xl"
                    style={{
                      transform: `rotate(${(i - 4) * 5}deg)`,
                      opacity: 0.5 + (i % 3) * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="max-w-7xl mx-auto px-6 -mt-3 mb-20 relative z-10">
        <Link
          href="/all-tools"
          className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-2xl p-5 no-underline transition-all hover:border-gray-700 hover:bg-gray-800 shadow-xl shadow-black/20"
        >
          <Search className="w-5 h-5 text-gray-500 flex-shrink-0" />
          <span className="flex-1 text-gray-500 text-[15px]">
            Search tools (PDF merge, image resize, markdown...)
          </span>
          <div className="flex items-center gap-1.5">
            <kbd className="px-2.5 py-1 text-xs font-mono bg-gray-950 border border-gray-800 rounded-md text-gray-500">⌘</kbd>
            <kbd className="px-2.5 py-1 text-xs font-mono bg-gray-950 border border-gray-800 rounded-md text-gray-500">K</kbd>
          </div>
        </Link>
      </section>

      {/* Popular Tools */}
      <section id="popular" className="max-w-7xl mx-auto px-6 mb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="flex items-center gap-2.5 text-xl font-bold text-gray-100 m-0">
            <Sparkles className="w-5 h-5 text-gray-100" />
            Popular Tools
          </h2>
          <Link href="/all-tools" className="text-sm font-medium text-gray-400 no-underline hover:text-gray-200 transition-colors">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
          {popularTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-7 no-underline transition-all hover:bg-gray-800 hover:border-gray-700 group hover:shadow-xl hover:shadow-black/20"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-gray-200" />
                </div>
                <h3 className="font-semibold text-gray-200 m-0 mb-2 text-base">{tool.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed m-0">{tool.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Browse by Category */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <h2 className="text-xl font-bold text-gray-100 m-0 mb-8">Browse by Category</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="flex items-center gap-5 bg-gray-900 border border-gray-800 rounded-2xl p-7 no-underline transition-all hover:bg-gray-800 hover:border-gray-700 hover:shadow-xl hover:shadow-black/20 group"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gray-800 group-hover:scale-105 transition-transform duration-300"
                >
                  {/* For monochrome, force icons to be white/gray regardless of category color, strictly speaking. Or keep category colors but desaturated? User said "monochrome". Let's try strictly monochrome for now or very subtle. */}
                  {/* Actually, user said "make monochrome if needed". I will force white icon to be safe. */}
                  <Icon className="w-7 h-7 text-gray-200" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-200 text-lg m-0 mb-1">{cat.name}</h3>
                  <p className="text-sm text-gray-500 m-0">
                    <span className="text-gray-300 font-medium">{cat.tags.length + 4} Tools</span>
                    {"  ·  "}
                    {cat.tags.join(", ")}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { getPopularTools, categories } from "@/lib/toolsRegistry";

export default function HomePage() {
  const popularTools = getPopularTools();

  return (
    <div className="min-h-screen bg-transparent relative selection:bg-blue-100 dark:selection:bg-blue-500/30 selection:text-blue-900 dark:selection:text-blue-200 transition-colors duration-300">

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-16">
            <div className="max-w-xl">
              <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.1] tracking-tight text-gray-900 dark:text-gray-100 m-0">
                All your everyday tools.{" "}
                <span className="text-gray-500 dark:text-gray-500">One clean place.</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 dark:text-gray-400 leading-relaxed m-0 font-medium">
                PDF, images, text, and developer utilities - fast, private, and free. No uploads, no ads, just pure utility.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/all-tools"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 dark:bg-blue-600 text-white font-semibold text-[15px] rounded-xl no-underline shadow-xl shadow-gray-900/10 dark:shadow-blue-900/20 transition-all hover:bg-gray-800 dark:hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Browse Tools <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#popular"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-[15px] rounded-xl no-underline transition-all hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 shadow-sm"
                >
                  Popular Tools
                </Link>
              </div>
            </div>

            {/* Hero graphic - Abstract geometric shapes */}
            <div className="relative w-[320px] h-[320px] flex-shrink-0">
              <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
              <div className="relative grid grid-cols-2 gap-4 animate-in fade-in zoom-in duration-1000 slide-in-from-bottom-10">
                <div className="bg-white dark:bg-[#151920] p-6 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center gap-3 transform rotate-[-6deg] hover:rotate-0 transition-transform duration-500">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-500">
                    <Sparkles size={24} />
                  </div>
                  <span className="font-bold text-gray-900 dark:text-gray-100">Clean</span>
                </div>
                <div className="bg-white dark:bg-[#151920] p-6 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center gap-3 transform translate-y-8 rotate-[3deg] hover:rotate-0 transition-transform duration-500">
                  <div className="w-12 h-12 bg-purple-50 dark:bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-500">
                    <Search size={24} />
                  </div>
                  <span className="font-bold text-gray-900 dark:text-gray-100">Fast</span>
                </div>
                <div className="bg-white dark:bg-[#151920] p-6 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center gap-3 transform -translate-y-4 rotate-[5deg] hover:rotate-0 transition-transform duration-500 col-span-2 w-2/3 mx-auto">
                  <div className="h-2 w-20 bg-gray-100 dark:bg-gray-800 rounded-full" />
                  <div className="h-2 w-12 bg-gray-100 dark:bg-gray-800 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="max-w-4xl mx-auto px-6 -mt-8 mb-24 relative z-20">
        <Link
          href="/all-tools"
          className="flex items-center gap-4 bg-white dark:bg-[#151920] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 pl-6 no-underline transition-all hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 shadow-xl shadow-gray-200/60 dark:shadow-black/50 group"
        >
          <Search className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
          <span className="flex-1 text-gray-500 dark:text-gray-400 text-[16px] font-medium group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
            Search 20+ tools (PDF, images, converters...)
          </span>
          <div className="flex items-center gap-1.5 pr-2">
            <kbd className="px-2 py-1 text-xs font-sans font-semibold bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400">⌘K</kbd>
          </div>
        </Link>
      </section>

      {/* Popular Tools */}
      <section id="popular" className="max-w-7xl mx-auto px-6 mb-24 relative z-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 m-0 tracking-tight">Most Popular</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Tools used by thousands every day</p>
          </div>
          <Link href="/all-tools" className="text-sm font-semibold text-blue-600 dark:text-blue-400 no-underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors bg-blue-50 dark:bg-blue-500/10 px-4 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
          {popularTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="bg-white dark:bg-[#151920] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 no-underline transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/50 group block h-full flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-[#1a1e27] border border-gray-100 dark:border-gray-800 flex items-center justify-center mb-5 group-hover:bg-blue-500 group-hover:border-blue-500 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 m-0 mb-2 text-lg">{tool.name}</h3>
                <p className="text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed m-0">{tool.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Browse by Category */}
      <section className="max-w-7xl mx-auto px-6 mb-24 relative z-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 m-0 mb-10 tracking-tight">Browse Categories</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="flex items-start gap-5 bg-white dark:bg-[#151920] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 no-underline transition-all hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-xl hover:shadow-gray-200/40 dark:hover:shadow-black/40 group relative overflow-hidden"
              >
                {/* Decorative background blob */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-gray-50 dark:bg-gray-800/50 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 transition-colors duration-500" />

                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-white dark:bg-[#1a1e27] border border-gray-100 dark:border-gray-800 shadow-sm relative z-10 group-hover:scale-110 transition-transform duration-300"
                  style={{ color: cat.color }} // Use category color for icon in light mode for vibrance
                >
                  <Icon className="w-7 h-7" /> {/* Inherits color */}
                </div>
                <div className="relative z-10">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg m-0 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{cat.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 m-0 mb-3 leading-relaxed">
                    {cat.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cat.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded-md border border-gray-100 dark:border-gray-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

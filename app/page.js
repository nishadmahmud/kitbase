"use client";

import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { getPopularTools, categories } from "@/lib/toolsRegistry";

export default function HomePage() {
  const popularTools = getPopularTools();

  return (
    <div>
      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at top right, rgba(79,140,255,0.08) 0%, transparent 50%)",
        }} />
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "80px 24px 96px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "64px" }}>
            <div style={{ maxWidth: "540px" }}>
              <h1 style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em", color: "#e6e8ee", margin: 0 }}>
                All your everyday tools.{" "}
                <span style={{ color: "#4f8cff" }}>One clean place.</span>
              </h1>
              <p style={{ marginTop: "24px", fontSize: "18px", color: "#9aa0aa", lineHeight: 1.7, marginBottom: 0 }}>
                PDF, images, text, and developer utilities — fast, private, and free. No uploads, no ads, just pure utility.
              </p>
              <div style={{ marginTop: "40px", display: "flex", flexWrap: "wrap", gap: "16px" }}>
                <Link
                  href="/all-tools"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    padding: "14px 28px", backgroundColor: "#4f8cff", color: "white",
                    fontWeight: 600, fontSize: "15px", borderRadius: "12px", textDecoration: "none",
                    boxShadow: "0 8px 24px rgba(79,140,255,0.25)",
                    transition: "all 0.2s",
                  }}
                >
                  Browse Tools <ArrowRight style={{ width: "16px", height: "16px" }} />
                </Link>
                <Link
                  href="#popular"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    padding: "14px 28px", border: "1px solid #2a2f3a", color: "#e6e8ee",
                    fontWeight: 600, fontSize: "15px", borderRadius: "12px", textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                >
                  Popular Tools
                </Link>
              </div>
            </div>

            {/* Hero graphic */}
            <div style={{
              position: "relative", width: "300px", height: "300px", flexShrink: 0,
              background: "linear-gradient(135deg, rgba(79,140,255,0.12) 0%, rgba(79,140,255,0.04) 100%)",
              borderRadius: "24px", border: "1px solid #2a2f3a",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", padding: "32px", opacity: 0.5 }}>
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: "56px", height: "56px",
                      backgroundColor: "#171a21", border: "1px solid #2a2f3a",
                      borderRadius: "12px",
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
      <section style={{ maxWidth: "1280px", margin: "-12px auto 80px", padding: "0 24px" }}>
        <Link
          href="/all-tools"
          style={{
            display: "flex", alignItems: "center", gap: "12px",
            backgroundColor: "#171a21", border: "1px solid #2a2f3a",
            borderRadius: "16px", padding: "20px 24px",
            textDecoration: "none", transition: "all 0.2s",
          }}
        >
          <Search style={{ width: "20px", height: "20px", color: "#6b7280", flexShrink: 0 }} />
          <span style={{ flex: 1, color: "#6b7280", fontSize: "15px" }}>
            Search tools (PDF merge, image resize, markdown...)
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <kbd style={{ padding: "4px 10px", fontSize: "12px", fontFamily: "monospace", backgroundColor: "#0f1115", border: "1px solid #2a2f3a", borderRadius: "6px", color: "#6b7280" }}>⌘</kbd>
            <kbd style={{ padding: "4px 10px", fontSize: "12px", fontFamily: "monospace", backgroundColor: "#0f1115", border: "1px solid #2a2f3a", borderRadius: "6px", color: "#6b7280" }}>K</kbd>
          </div>
        </Link>
      </section>

      {/* Popular Tools */}
      <section id="popular" style={{ maxWidth: "1280px", margin: "0 auto 96px", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
          <h2 style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "20px", fontWeight: 700, color: "#e6e8ee", margin: 0 }}>
            <Sparkles style={{ width: "20px", height: "20px", color: "#4f8cff" }} />
            Popular Tools
          </h2>
          <Link href="/all-tools" style={{ fontSize: "14px", fontWeight: 500, color: "#4f8cff", textDecoration: "none" }}>
            View all
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
          {popularTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                style={{
                  backgroundColor: "#171a21", border: "1px solid #2a2f3a",
                  borderRadius: "16px", padding: "28px",
                  textDecoration: "none", transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3a4050"; e.currentTarget.style.backgroundColor = "#1e2230"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a2f3a"; e.currentTarget.style.backgroundColor = "#171a21"; }}
              >
                <div style={{
                  width: "48px", height: "48px", borderRadius: "12px",
                  backgroundColor: "rgba(79,140,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "20px",
                }}>
                  <Icon style={{ width: "24px", height: "24px", color: "#4f8cff" }} />
                </div>
                <h3 style={{ fontWeight: 600, color: "#e6e8ee", margin: "0 0 8px", fontSize: "16px" }}>{tool.name}</h3>
                <p style={{ fontSize: "14px", color: "#9aa0aa", lineHeight: 1.6, margin: 0 }}>{tool.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Browse by Category */}
      <section style={{ maxWidth: "1280px", margin: "0 auto 96px", padding: "0 24px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#e6e8ee", margin: "0 0 32px" }}>Browse by Category</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                style={{
                  display: "flex", alignItems: "center", gap: "20px",
                  backgroundColor: "#171a21", border: "1px solid #2a2f3a",
                  borderRadius: "16px", padding: "28px",
                  textDecoration: "none", transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3a4050"; e.currentTarget.style.backgroundColor = "#1e2230"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a2f3a"; e.currentTarget.style.backgroundColor = "#171a21"; }}
              >
                <div style={{
                  width: "56px", height: "56px", borderRadius: "16px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, backgroundColor: `${cat.color}15`,
                }}>
                  <Icon style={{ width: "28px", height: "28px", color: cat.color }} />
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, color: "#e6e8ee", fontSize: "18px", margin: "0 0 4px" }}>{cat.name}</h3>
                  <p style={{ fontSize: "14px", color: "#9aa0aa", margin: 0 }}>
                    <span style={{ color: "#4f8cff", fontWeight: 500 }}>{cat.tags.length + 4} Tools</span>
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

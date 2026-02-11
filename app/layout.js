import { Analytics } from "@vercel/analytics/next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/providers";

import MobileBottomNav from "@/components/layout/MobileBottomNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata = {
  metadataBase: new URL('https://kitbase.tech'),
  title: {
    default: "Kitbase - Ultimate Free Online Tools | PDF, Image, Dev & Text Utilities",
    template: "%s | Kitbase - Free Online Tools",
  },
  description:
    "The most powerful collection of free online tools. Edit PDFs, resize images, format JSON, convert text, and more. No signup, no ads, 100% private and fast.",
  keywords: [
    "online tools", "free pdf editor", "merge pdf", "split pdf", "compress pdf",
    "image resizer", "image compressor", "image converter", "crop image",
    "json formatter", "base64 encoder", "sql formatter", "regex tester",
    "word counter", "case converter", "text cleaner", "lorem ipsum generator",
    "password generator", "hash generator", "token generator",
    "pomodoro timer", "stopwatch", "loan calculator", "unit converter",
    "developer tools", "web utilities", "free software", "productivity tools"
  ],
  authors: [{ name: "Nishad Mahmud", url: "https://kitbase.tech" }],
  creator: "Nishad Mahmud",
  publisher: "Kitbase",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Kitbase - Ultimate Free Online Tools",
    description: "PDF, images, text, and developer utilities - fast, private, and free. No uploads, no ads, just pure utility.",
    url: "https://kitbase.tech",
    siteName: "Kitbase",
    images: [
      {
        url: "/og-image.png", // We should ideally have an og-image
        width: 1200,
        height: 630,
        alt: "Kitbase Tools Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kitbase - Ultimate Free Online Tools",
    description: "Power up your productivity with our suite of free online tools. PDF, Images, Dev, and more.",
    creator: "@nishadmahmud", // Replace with actual handle if available
    images: ["/og-image.png"],
  },
  verification: {
    google: "FUFdJgc3ly_bHapVPlCnmIoUlsVQtLm6EL723I-rcA8",
  },
  category: "productivity",
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-200 font-sans min-h-screen m-0 p-0 flex flex-col antialiased transition-colors duration-300 relative pb-16 md:pb-0">
        {/* Background Grid Pattern - Global */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />

        <Providers>
          <Navbar />
          <main className="flex-1 relative z-10">{children}</main>
          <Footer />
          <MobileBottomNav />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}

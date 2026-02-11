import { Analytics } from "@vercel/analytics/next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata = {
  title: "Kitbase - All Your Everyday Tools. One Clean Place.",
  description:
    "PDF, images, text, and developer utilities — fast, private, and free. No uploads, no ads, just pure utility.",
  verification: {
    google: "FUFdJgc3ly_bHapVPlCnmIoUlsVQtLm6EL723I-rcA8",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-200 font-sans min-h-screen m-0 p-0 flex flex-col antialiased transition-colors duration-300 relative">
        {/* Background Grid Pattern - Global */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />

        <Providers>
          <Navbar />
          <main className="flex-1 relative z-10">{children}</main>
          <Footer />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}

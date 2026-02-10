import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body
        style={{
          backgroundColor: "#0f1115",
          color: "#e6e8ee",
          fontFamily: "var(--font-inter), system-ui, -apple-system, sans-serif",
          minHeight: "100vh",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        <Navbar />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

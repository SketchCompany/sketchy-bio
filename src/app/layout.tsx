import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Roboto_Serif, Geist_Mono } from "next/font/google";
import { baseSiteMetadata } from "@/lib/seo";
import "./globals.css";

// Display / headings — the high-contrast serif that plays against the graffiti logo.
const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

// Body / UI text.
const body = Roboto_Serif({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

// Utility / metadata (kickers, track numbers).
const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

// Metadata is built from the admin-entered profile, so it always tracks the
// artist name / tagline / images without code changes.
export async function generateMetadata(): Promise<Metadata> {
  return baseSiteMetadata();
}

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      {/* suppressHydrationWarning: browser extensions (ColorZilla, Grammarly, …)
          inject attributes on <body> before React hydrates. */}
      <body className="min-h-full" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// body
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-body",
  weight: "100 900",
  display: "swap",
});

// mono, for labels and timestamps
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ResearchAI — Web Research, Summarized",
  description:
    "Type a topic. ResearchAI searches the live web, reads the results, and writes a structured report with every source listed.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // match the page bg so the mobile address bar blends in
  themeColor: "#0D0D0D",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}

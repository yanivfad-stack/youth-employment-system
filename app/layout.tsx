import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

// ============================================================================
// CRITICAL: Force all pages to render dynamically (not static)
// This prevents Next.js from prerendering pages at build time
// which would trigger Firebase initialization errors
// ============================================================================
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable ISR, always render at request time
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "מערכת ניהול תעסוקת צעירים",
  description: "מערכת ניהול תעסוקת צעירים - ניהול תעסוקה של עובדים צעירים בגיל 15-18",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

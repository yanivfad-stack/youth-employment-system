import type { Metadata } from "next";
import dynamicImport from "next/dynamic";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ============================================================================
// CRITICAL: Force all pages to render dynamically (not static)
// This prevents Next.js from prerendering pages at build time
// which would trigger Firebase initialization errors
// ============================================================================
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable ISR, always render at request time

// Dynamically import AuthProvider with ssr disabled
// AuthProvider contains Firebase context which should ONLY initialize in browser
// By using dynamic with ssr: false, AuthProvider is loaded in browser only
const AuthProvider = dynamicImport(
  () => import("@/lib/firebase/context").then(mod => ({ default: mod.AuthProvider })),
  {
    ssr: false, // Critical: Do NOT render on server during build
    loading: () => null,
  }
);

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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

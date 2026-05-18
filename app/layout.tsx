import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Dynamically import AuthProvider to prevent eager Firebase initialization during build
// Using ssr: true but importing lazily allows it to render on server without initializing Firebase
const AuthProvider = dynamic(() => import("@/lib/firebase/context").then(mod => ({ default: mod.AuthProvider })), {
  ssr: true,
  loading: () => null,
});

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

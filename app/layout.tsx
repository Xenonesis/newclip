import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "@/components/providers/SessionProvider";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ClipFlow AI - Turn Long Videos Into Viral Clips",
  description: "Upload once, publish everywhere. ClipFlow AI automatically finds the best moments, adds captions, and schedules posts across all your social platforms.",
  keywords: ["video repurposing", "AI clips", "social media scheduling", "content creator", "TikTok", "Instagram Reels", "YouTube Shorts"],
  authors: [{ name: "ClipFlow AI" }],
  openGraph: {
    title: "ClipFlow AI - Turn Long Videos Into Viral Clips",
    description: "AI-powered video repurposing and social media management platform",
    type: "website",
    url: "https://clipflow.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClipFlow AI - Turn Long Videos Into Viral Clips",
    description: "AI-powered video repurposing and social media management platform",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        {/* Skip to main content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--primary)] focus:text-white focus:rounded-lg focus:outline-none"
        >
          Skip to main content
        </a>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}

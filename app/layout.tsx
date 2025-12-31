import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClipFlow AI - Turn Long Videos Into Viral Clips",
  description: "Upload once, publish everywhere. ClipFlow AI automatically finds the best moments, adds captions, and schedules posts across all your social platforms.",
  keywords: ["video repurposing", "AI clips", "social media scheduling", "content creator", "TikTok", "Instagram Reels", "YouTube Shorts"],
  authors: [{ name: "ClipFlow AI" }],
  openGraph: {
    title: "ClipFlow AI - Turn Long Videos Into Viral Clips",
    description: "AI-powered video repurposing and social media management platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

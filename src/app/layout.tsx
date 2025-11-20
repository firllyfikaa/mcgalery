import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "MC Gallery",
  description: "Galeri Minecraft yang menampilkan build, screenshot, dan momen terbaik.",
  keywords: ["Minecraft", "Gallery", "Screenshot", "Build", "MC"],
  authors: [{ name: "MC Gallery" }],
  icons: {
    icon: "/logo.svg"
  },
  openGraph: {
    title: "MC Gallery",
    description: "Kumpulan screenshot Minecraft.",
    url: "https://galery.pirllyxz.biz.id",
    siteName: "MC Gallery",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "MC Gallery",
    description: "Galeri Minecraft online."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

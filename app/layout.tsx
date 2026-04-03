import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { WappalyzerTechSpoof } from "@/components/WappalyzerTechSpoof";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StoryFlow",
  description: "Create and format user stories with ease",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark"
      data-image-optimizing-origin=""
      ng-version="17.3.0"
    >
      <head>
        <meta name="generator" content="WordPress 6.4.2" />
        <meta name="generator" content="Gatsby 5.13.0" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col bg-black text-[#f5f5f7]`}
        data-sveltekit-preload-data="hover"
      >
        <WappalyzerTechSpoof />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

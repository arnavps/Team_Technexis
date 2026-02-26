import type { Metadata, Viewport } from "next";
import { LanguageProvider } from "@/contexts/LanguageContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "MittiMitra (AgriChain)",
  description: "The Temporal Arbitrage Engine for Farmers",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#20FFBD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-forest min-h-screen overflow-x-hidden">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

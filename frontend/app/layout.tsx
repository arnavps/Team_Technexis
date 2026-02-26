import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KrishiAI (AgriChain)",
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
      <body className="antialiased bg-forest min-h-screen">
        {children}
      </body>
    </html>
  );
}

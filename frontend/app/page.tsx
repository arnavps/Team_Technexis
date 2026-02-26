"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-forest text-white selection:bg-mint selection:text-forest overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-mint/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>

      {/* Navigation Layer */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12 lg:px-24 mx-auto max-w-7xl">
        <div className="flex items-center space-x-2">
          <svg className="w-8 h-8 text-mint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <span className="text-2xl font-black tracking-tighter"><span className="text-mint">Mitti</span>Mitra</span>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
          <Link href="#features" className="hover:text-mint transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-mint transition-colors">How it Works</Link>
          <Link href="#impact" className="hover:text-mint transition-colors">Impact</Link>
        </div>
        <div>
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-full bg-white/5 border border-glass-border hover:bg-white/10 hover:border-mint/50 transition-all font-semibold backdrop-blur-md"
          >
            Farmer Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-24 pb-32 md:pt-40 mx-auto max-w-5xl">

        {/* Badge */}
        <div className="mb-8 inline-flex items-center rounded-full border border-mint/30 bg-mint/10 px-4 py-1.5 text-sm font-medium text-mint shadow-[0_0_15px_rgba(32,255,189,0.15)] animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-mint animate-pulse mr-2"></span>
          The 72-Hour Temporal Arbitrage Engine
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1] animate-fade-in-up md:animate-delay-100">
          Stop Selling at a Loss. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint to-blue-400">
            Start Selling at the Peak.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 animate-fade-in-up md:animate-delay-200">
          MittiMitra is a Decision Support System that ingests hyper-local weather, Mandi prices, and transport costs to tell you exactly <strong>when</strong>, <strong>where</strong>, and <strong>why</strong> to sell your harvest for maximum profit.
        </p>

        <div className="flex flex-col sm:flex-row items-center font-bold space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up md:animate-delay-300">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-mint text-forest hover:bg-white transition-all shadow-[0_0_30px_rgba(32,255,189,0.3)] hover:shadow-[0_0_40px_rgba(32,255,189,0.5)] transform hover:-translate-y-1"
          >
            Enter Decision Hub
          </Link>
          <Link
            href="#demo"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-transparent border border-gray-600 text-white hover:border-white transition-colors"
          >
            Watch Demo
          </Link>
        </div>
      </main>

      {/* Feature Bento Grid */}
      <section className="relative z-10 px-6 py-24 bg-black/40 border-t border-glass-border">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Farm Intelligence, <br />Simplified.</h2>
            <p className="text-gray-400">Everything you need to beat market volatility, in one glassy dashboard.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Bento Box 1: Shock Analyzer */}
            <div className="md:col-span-2 relative overflow-hidden rounded-3xl border border-glass-border bg-glass-bg backdrop-blur-md p-8 hover:border-mint/50 transition-colors group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-red-500/20 transition-colors"></div>
              <svg className="w-10 h-10 text-red-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <h3 className="text-2xl font-bold mb-2">Black Swan Shock Analyzer</h3>
              <p className="text-gray-400 max-w-md">Using Z-score volatility mapping, we detect sudden price crashes and extreme weather 24 hours before they hit, automatically generating emergency pivot advice to cold storage.</p>
            </div>

            {/* Bento Box 2: Voice AI */}
            <div className="relative overflow-hidden rounded-3xl border border-glass-border bg-glass-bg backdrop-blur-md p-8 hover:border-mint/50 transition-colors group">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-mint/10 rounded-full blur-2xl group-hover:bg-mint/20 transition-colors"></div>
              <svg className="w-10 h-10 text-mint mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              <h3 className="text-2xl font-bold mb-2">Agri-Vakeel AI</h3>
              <p className="text-gray-400">Speak to your dashboard in Hindi or Marathi. Powered by Groq & Llama 3 for sub-second, empathetic advice.</p>
            </div>

            {/* Bento Box 3: Offline */}
            <div className="relative overflow-hidden rounded-3xl border border-glass-border bg-glass-bg backdrop-blur-md p-8 hover:border-mint/50 transition-colors group">
              <svg className="w-10 h-10 text-blue-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h3 className="text-2xl font-bold mb-2">PWA Offline Resilience</h3>
              <p className="text-gray-400">Works in the field. Caches data and voice responses via Service Workers when you lose signal.</p>
            </div>

            {/* Bento Box 4: Arbitrage */}
            <div className="md:col-span-2 relative overflow-hidden rounded-3xl border border-glass-border bg-glass-bg backdrop-blur-md p-8 hover:border-mint/50 transition-colors group">
              <div className="absolute inset-0 bg-gradient-to-r from-mint/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <svg className="w-10 h-10 text-mint mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              <h3 className="text-2xl font-bold mb-2">The Net Realization Algorithm</h3>
              <p className="text-gray-400 max-w-md">We don't just show you Mandi prices. We deduct your specific GPS-based transport cost and apply an environmental spoofing penalty to calculate your exact Net Take-Home Profit.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-glass-border py-12 text-center text-sm text-gray-500">
        <p>© 2026 MittiMitra. Built for Indian smallholder farmers.</p>
      </footer>
    </div>
  );
}

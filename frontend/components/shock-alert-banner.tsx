"use client";

import { useState, useEffect } from "react";

interface ShockAlertProps {
    message: string;
    pivotAdvice: string;
}

export function ShockAlertBanner({ message, pivotAdvice }: ShockAlertProps) {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    // Per rules: Only appears if Z-score Volatility > 2σ (Assuming this is triggered by the parent component passing props)
    // Styling constraint: Thin, pulsing glass banner at the top.

    return (
        <div className="relative overflow-hidden w-full bg-blue-900/20 border border-blue-400/30 rounded-xl p-3 mb-6 shadow-[0_0_15px_rgba(96,165,250,0.15)] animate-pulse-slow backdrop-blur-md">
            {/* Decorative pulse background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 animate-shimmer"></div>

            <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400">
                        <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                        <span className="text-blue-300 font-bold text-sm tracking-wide">Market Insight:</span>
                        <span className="text-gray-300 text-sm">Sudden volume spike detected; recalculating best route...</span>
                    </div>
                </div>

                <button
                    onClick={() => setIsVisible(false)}
                    className="text-blue-300/70 hover:text-white transition-colors ml-4"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

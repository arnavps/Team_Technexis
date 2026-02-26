"use client";

import { useState, useEffect } from "react";

interface ShockAlertProps {
    message: string;
    pivotAdvice: string;
}

export function ShockAlertBanner({ message, pivotAdvice }: ShockAlertProps) {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="relative overflow-hidden w-full bg-red-900/40 border border-red-500/50 rounded-xl p-4 mb-6 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse-slow">
            {/* Decorative pulse background */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 animate-shimmer"></div>

            <div className="relative z-10 flex items-start justify-between">
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center text-red-400 font-bold text-lg">
                        <svg className="w-6 h-6 mr-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        BLACK SWAN ALERT
                    </div>
                    <p className="text-white font-medium">{message}</p>
                    <div className="mt-2 p-3 bg-red-950/50 rounded-lg border border-red-500/30 text-red-200 text-sm flex items-start">
                        <svg className="w-5 h-5 mr-2 shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold">{pivotAdvice}</span>
                    </div>
                </div>

                <button
                    onClick={() => setIsVisible(false)}
                    className="text-red-300 hover:text-white transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

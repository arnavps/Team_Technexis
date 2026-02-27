'use client';

import { GlassCard } from '@/components/glass-card';

interface VakeelBriefProps {
    brief: string;
}

export function VakeelBrief({ brief }: VakeelBriefProps) {
    if (!brief) return null;

    return (
        <GlassCard className="mt-6 py-3 px-6 overflow-hidden relative group">
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-mint"></span>
                    </span>
                </div>

                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-white/90 leading-relaxed truncate group-hover:whitespace-normal transition-all duration-300">
                        <span className="text-mint font-bold mr-2 uppercase tracking-widest text-[10px]">MittiMitra Brief:</span>
                        {brief}
                    </p>
                </div>

                <div className="flex-shrink-0 text-gray-500">
                    <svg className="w-4 h-4 animate-bounce-horizontal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </div>
            </div>

            {/* Ambient Background Ticker Effect */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none font-mono text-8xl flex items-center justify-center whitespace-nowrap select-none italic text-mint">
                MITTIMITRA AI INSIGHT • LIVE ARBITRAGE • {brief.split(' ')[0]}...
            </div>
        </GlassCard>
    );
}

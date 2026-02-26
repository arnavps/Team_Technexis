'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { GlassCard } from '@/components/glass-card';

export default function MarketMapsPage() {
    const { t } = useLanguage();

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
            <header className="relative z-50 flex flex-col mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Market Maps</h1>
                <p className="text-sm text-gray-400">Spatial Price Distribution & Logistics Analysis</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="h-96 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 rounded-full bg-mint/10 border border-mint/20 flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Regional Price Heatmap</h2>
                    <p className="text-gray-400 text-sm max-w-md">
                        Visualize Mandi prices across Maharashtra. High-demand zones are highlighted in neon-mint.
                    </p>
                    <div className="mt-8 w-full h-32 border border-dashed border-white/10 rounded-xl flex items-center justify-center bg-white/5">
                        <span className="text-gray-500 font-mono text-xs">MAP_ENGINE_INITIALIZING...</span>
                    </div>
                </GlassCard>

                <GlassCard className="h-96 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L16 4m0 13V4m0 0L9 7" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Transport Optimization</h2>
                    <p className="text-gray-400 text-sm max-w-md">
                        Real-time logistics cost calculation based on GPS and fuel indices.
                    </p>
                    <div className="mt-8 space-y-3 w-full max-w-xs">
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[65%]"></div>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-mint w-[40%]"></div>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}

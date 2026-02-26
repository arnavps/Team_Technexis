'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { GlassCard } from '@/components/glass-card';
import { useOfflineCache } from '@/hooks/useOfflineCache';
import { StatusPill } from '@/components/status-pill';

export default function MarketMapsPage() {
    const { t } = useLanguage();
    const { cachedData } = useOfflineCache('dashboard_recommendation');

    // Fallback to empty array if data isn't loaded yet
    const regionalOptions = cachedData?.regional_options || [];
    const activeShock = cachedData?.shock_alert;

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
            <header className="relative z-50 flex flex-col mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Market Maps & Logistics</h1>
                        <p className="text-sm text-gray-400">Spatial Profit Analysis & Route Decay Tracking</p>
                    </div>
                    {activeShock?.pivot_mandi && (
                        <div className="bg-red-500/20 border border-red-500/50 px-4 py-2 rounded-xl text-right">
                            <span className="text-xs text-red-400 font-bold uppercase tracking-wider block">Active Re-route</span>
                            <span className="text-white text-sm">Pivoting to: {activeShock.pivot_mandi.mandi_name}</span>
                        </div>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Visual "Map" Alternative - Logistics List */}
                <GlassCard className="col-span-1 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-mint/10 border border-mint/20 flex items-center justify-center">
                                <svg className="w-5 h-5 text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L16 4m0 13V4m0 0L9 7" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-white">Spatial Profit Analysis</h2>
                        </div>
                        <StatusPill status="GREEN" message="Live GPS Transit Data" />
                    </div>

                    <p className="text-gray-400 text-sm mb-6 max-w-2xl">
                        Evaluating all regional destinations. We rank markets not by distance alone, but by absolute Net Realization (Market Price minus Logistics minus Heat Decay Spoilage).
                    </p>

                    <div className="space-y-4">
                        {regionalOptions.length === 0 ? (
                            <div className="text-center py-10 border border-dashed border-white/10 rounded-xl bg-white/5">
                                <span className="text-gray-500 font-mono text-sm">Waiting for Decision Engine data...</span>
                            </div>
                        ) : (
                            regionalOptions.map((option: any, index: number) => {
                                const isPivot = activeShock?.pivot_mandi?.mandi_name === option.mandi_name;
                                const isPrimary = index === 0 && !activeShock;
                                const isRecommended = isPivot || isPrimary;

                                return (
                                    <div
                                        key={index}
                                        className={`relative overflow-hidden rounded-2xl border p-5 transition-all
                                        ${isRecommended
                                                ? 'bg-mint/10 border-mint/30 shadow-[0_0_15px_rgba(32,255,189,0.1)]'
                                                : option.is_dead_zone
                                                    ? 'bg-red-900/10 border-red-500/20'
                                                    : 'bg-white/5 border-white/10 hover:bg-white/10'}
                                    `}
                                    >
                                        {isRecommended && (
                                            <div className="absolute top-0 right-0 bg-mint text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg z-10">
                                                {isPivot ? "EMERGENCY PIVOT" : "PRIMARY ROUTE"}
                                            </div>
                                        )}

                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-white flex items-center">
                                                    {option.mandi_name}
                                                    {option.is_cold_storage && (
                                                        <span className="ml-2 text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">COLD STORAGE</span>
                                                    )}
                                                    {option.is_dead_zone && (
                                                        <span className="ml-2 text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30">DEAD ZONE</span>
                                                    )}
                                                </h3>
                                                <div className="flex items-center space-x-4 mt-2 text-sm">
                                                    <span className="text-gray-400 flex items-center">
                                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                                                        {roundVal(option.distance_km)} km
                                                    </span>
                                                    <span className="text-gray-400 flex items-center">
                                                        <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-2"></span>
                                                        {option.estimated_transit_hours} hrs transit
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-6">
                                                <div className="text-right hidden md:block">
                                                    <span className="text-xs text-gray-500 uppercase tracking-widest block font-bold mb-1">Raw Price</span>
                                                    <span className="text-white">₹{option.market_price}/Qtl</span>
                                                </div>

                                                <div className="h-10 w-px bg-white/10 hidden md:block"></div>

                                                <div className="text-right hidden md:block">
                                                    <span className="text-xs text-gray-500 uppercase tracking-widest block font-bold mb-1 border-b border-red-500/50 pb-0.5 inline-block">Q10 Heat Decay</span>
                                                    <span className={option.is_dead_zone ? "text-red-400 font-bold" : "text-gray-300"}>
                                                        -{option.quality_loss_pct}%
                                                    </span>
                                                </div>

                                                <div className="h-10 w-px bg-white/10 hidden md:block"></div>

                                                <div className="text-right">
                                                    <span className="text-xs text-mint/60 uppercase tracking-widest block font-bold mb-1">Net Realization</span>
                                                    <span className={`text-2xl font-mono font-bold ${isRecommended ? 'text-mint drop-shadow-[0_0_8px_rgba(32,255,189,0.3)]' : 'text-white'}`}>
                                                        ₹{(option.total_net_profit).toLocaleString('en-IN')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {option.is_dead_zone && (
                                            <div className="mt-4 text-xs text-red-400/80 bg-red-900/20 border border-red-500/20 p-2 rounded-lg">
                                                <strong>Warning:</strong> Transport time and current heat conditions will cause unacceptable spoilage (&gt;15%) before reaching this market.
                                            </div>
                                        )}
                                    </div>
                                )
                            })
                        )}
                    </div>
                </GlassCard>

                <GlassCard className="h-48 flex flex-col justify-center p-6">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Route Optimization Logic</h2>
                    <div className="space-y-4 font-mono text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Transport Rate</span>
                            <span className="text-white">₹15.0 / km</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Base Transit Speed</span>
                            <span className="text-white">30 km/hr</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Q10 Spoilage Active</span>
                            <span className="text-mint ml-2">ENABLED</span>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}

// helper
function roundVal(num: number) {
    return Math.round(num * 10) / 10;
}

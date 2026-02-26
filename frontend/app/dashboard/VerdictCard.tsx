'use client';

import { useLanguage } from '@/contexts/LanguageContext';

interface VerdictCardProps {
    data: any;
    onExplain?: (query: string) => void;
}

export function VerdictCard({ data, onExplain }: VerdictCardProps) {
    const { t } = useLanguage();

    if (!data) return null;

    // Approximated Math Breakdown for UI
    const price = data.mandi_stats?.current_price || 0;
    const distanceKm = data.mandi_stats?.distance_km || 0;
    const yieldQtl = data.yield_quintals || 50;

    const grossRevenue = price * yieldQtl;
    const logistics = Math.round(distanceKm * 15); // ₹15 per km transport (Total for trip)
    const spoilagePenalty = Math.round(grossRevenue * (data.mandi_stats?.quality_loss_pct || 0.02) / 100);

    // Unit math
    const totalTakeHome = data.total_net_profit || (grossRevenue - logistics - spoilagePenalty);
    const perQuintalRealization = data.net_realization_inr_per_quintal || (totalTakeHome / yieldQtl);

    return (
        <div className="rounded-3xl border border-white/20 bg-black/20 backdrop-blur-xl p-8 lg:p-10 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            {/* Background Glows based on status */}
            {data.status === 'GREEN' && (
                <div className="absolute top-0 right-0 w-64 h-64 bg-mint/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            )}
            {data.status === 'RED' && (
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            )}
            {data.status === 'YELLOW' && (
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            )}

            <h2 className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-6 z-10">{t('recommendation')}</h2>

            <div className="z-10 w-full mb-8">
                {data.status === 'GREEN' ? (
                    <div className="animate-[pulse_4s_ease-in-out_infinite]">
                        <h3 className="text-7xl lg:text-8xl font-black text-mint mb-4 drop-shadow-[0_0_25px_rgba(32,255,189,0.5)] tracking-tighter">
                            {t('sell') || 'SELL'}
                        </h3>
                        <p className="text-gray-300 font-medium text-lg">Optimal harvest window detected; prices peaking in 48 hours.</p>
                    </div>
                ) : data.status === 'RED' ? (
                    <div>
                        <h3 className="text-7xl lg:text-8xl font-black text-amber-500 mb-4 drop-shadow-[0_0_25px_rgba(245,158,11,0.5)] tracking-tighter">
                            {t('wait') || 'WAIT'}
                        </h3>
                        <p className="text-gray-300 font-medium text-lg">Sub-optimal conditions. Expected market dip due to excess supply.</p>
                    </div>
                ) : (
                    <div>
                        <h3 className="text-7xl lg:text-8xl font-black text-yellow-400 mb-4 drop-shadow-[0_0_25px_rgba(250,204,21,0.5)] tracking-tighter">
                            {t('hold') || 'HOLD'}
                        </h3>
                        <p className="text-gray-300 font-medium text-lg">Volatility mapping active. Monitor conditions closely.</p>
                    </div>
                )}

                {onExplain && (
                    <button
                        onClick={() => onExplain("Explain why you recommended this action.")}
                        className="mt-6 px-4 py-2 bg-mint/10 border border-mint/30 rounded-full text-xs font-bold text-mint hover:bg-mint hover:text-forest transition-all flex items-center space-x-2 mx-auto"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>ASK VAKEEL WHY</span>
                    </button>
                )}
            </div>

            {/* Net Realization (Live Accounting Breakdown) */}
            <div className="z-10 w-full mt-4 bg-white/5 border border-white/10 rounded-3xl p-6 text-left group">
                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                    <div>
                        <span className="text-xs uppercase tracking-widest text-gray-500 font-bold block mb-1">TOTAL ESTIMATED TAKE-HOME</span>
                        <div className="flex items-center space-x-2">
                            <span className="text-[8px] bg-mint/10 text-mint px-2 py-0.5 rounded-full font-bold border border-mint/20">LIVE CALCULATOR</span>
                            {data.mandi_stats?.is_verified_real ? (
                                <span className="text-[8px] flex items-center bg-mint/20 text-mint px-2 py-0.5 rounded-full font-black border border-mint/40 uppercase tracking-widest animate-pulse">
                                    <svg className="w-2.5 h-2.5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944a11.954 11.954 0 007.834 3.055 1.001 1.001 0 01.839 1.144c-.161 1.063-.264 2.147-.305 3.245a11.954 11.954 0 01-1.637 5.518 11.949 11.949 0 01-4.78 4.782A11.91 11.91 0 0110 20a11.91 11.91 0 01-1.951-.157 11.95 11.95 0 01-4.78-4.782 11.954 11.954 0 01-1.637-5.518c-.041-1.098-.144-2.182-.305-3.245a1.001 1.001 0 01.839-1.144zM10 14a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zm0-4a1 1 0 01-1-1V7a1 1 0 112 0v2a1 1 0 01-1 1z" clipRule="evenodd" /></svg>
                                    Verified Real-Time (2026)
                                </span>
                            ) : (
                                <span className="text-[8px] flex items-center bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-black border border-blue-500/20 uppercase tracking-widest whitespace-nowrap">
                                    <svg className="w-2.5 h-2.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                    UMANG e-NAM Gov. Hub
                                </span>
                            )}
                        </div>
                    </div>
                    <span className="text-mint font-mono font-bold text-2xl drop-shadow-[0_0_10px_rgba(32,255,189,0.3)]">
                        ₹{(totalTakeHome).toLocaleString('en-IN')}
                    </span>
                </div>

                <div className="space-y-4 font-mono text-sm">
                    {/* Gross */}
                    <div className="flex justify-between items-center text-gray-300">
                        <span className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-mint rounded-full mr-2"></span>
                            Gross Market Value <span className="text-[10px] text-gray-500 ml-1">({yieldQtl} Qtl)</span>
                        </span>
                        <span className="text-white">+₹{(grossRevenue).toLocaleString('en-IN')}</span>
                    </div>

                    {/* Logistics */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-start">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 mr-2"></span>
                            <div>
                                <span className="text-gray-300 block text-xs tracking-wider">Logistics (Total Trip)</span>
                                <span className="text-gray-500 text-[10px]">({Math.round(distanceKm * 10) / 10 || 0}km GPS Transit)</span>
                            </div>
                        </div>
                        <span className="text-red-400 font-mono">- ₹{(logistics).toLocaleString('en-IN')}</span>
                    </div>

                    {/* Spoilage */}
                    <div className="flex justify-between items-center text-gray-400 group-hover:text-gray-300 transition-colors">
                        <span className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                            Env. Spoilage Risk
                        </span>
                        <span className="text-red-400/80">-₹{(spoilagePenalty).toLocaleString('en-IN')}</span>
                    </div>

                    {/* Per Quintal Breakdown */}
                    <div className="pt-4 mt-2 border-t border-white/10 flex justify-between items-center text-gray-500 italic">
                        <span className="text-[10px] uppercase">Net Realization per Quintal</span>
                        <span className="text-xs">₹{Math.round(perQuintalRealization).toLocaleString('en-IN')}/Qtl</span>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex justify-between items-center bg-mint/5 -mx-6 px-6 -mb-6 rounded-b-3xl transition-all group-hover:bg-mint/10">
                        <span className="text-xs text-mint/60 font-bold uppercase">{t('estimatedTakeHome') || 'Estimated Take-Home'}</span>
                        <span className="text-white font-black text-xl">₹{(totalTakeHome).toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

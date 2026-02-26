"use client";
import { useLanguage } from '@/contexts/LanguageContext';

interface Mandi {
    id: string;
    name: string;
    distanceKm: number;
    currentPrice: number;
    netProfit: number;
    isOptimal: boolean;
}

export function MandiTable({ mandis }: { mandis: Mandi[] }) {
    const { t } = useLanguage();
    // Sort mandis by net profit descending
    const sortedMandis = [...mandis].sort((a, b) => b.netProfit - a.netProfit);

    return (
        <div className="w-full overflow-x-auto rounded-xl border border-glass-border bg-glass-bg backdrop-blur-md">
            <table className="w-full text-left text-sm text-gray-200">
                <thead className="bg-forest/50 text-xs uppercase text-gray-300 border-b border-glass-border">
                    <tr>
                        <th scope="col" className="px-6 py-4">{t('mandi')}</th>
                        <th scope="col" className="px-6 py-4">{t('dist')}</th>
                        <th scope="col" className="px-6 py-4">{t('price')}</th>
                        <th scope="col" className="px-6 py-4 font-bold text-mint">{t('netProfit')}</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedMandis.map((mandi) => (
                        <tr
                            key={mandi.id}
                            className={`border-b border-glass-border last:border-0 hover:bg-white/5 transition-all duration-300 ${mandi.isOptimal
                                    ? 'bg-mint/10 border-mint/30 shadow-[0_0_20px_rgba(32,255,189,0.15)] relative z-10'
                                    : ''
                                }`}
                        >
                            <td className="px-6 py-4 font-medium flex items-center whitespace-nowrap">
                                {mandi.isOptimal && <span className="w-2 h-2 rounded-full bg-mint mr-2 animate-pulse shadow-[0_0_8px_#20FFBD]"></span>}
                                {mandi.name}
                            </td>
                            <td className="px-6 py-4">{mandi.distanceKm} km</td>
                            <td className="px-6 py-4">₹{mandi.currentPrice}</td>
                            <td className={`px-6 py-4 font-bold ${mandi.isOptimal ? 'text-mint' : 'text-white'}`}>
                                ₹{mandi.netProfit.toLocaleString('en-IN')}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

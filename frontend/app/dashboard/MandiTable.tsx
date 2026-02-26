"use client";

interface Mandi {
    id: string;
    name: string;
    distanceKm: number;
    currentPrice: number;
    netProfit: number;
    isOptimal: boolean;
}

export function MandiTable({ mandis }: { mandis: Mandi[] }) {
    // Sort mandis by net profit descending
    const sortedMandis = [...mandis].sort((a, b) => b.netProfit - a.netProfit);

    return (
        <div className="w-full overflow-x-auto rounded-xl border border-glass-border bg-glass-bg backdrop-blur-md">
            <table className="w-full text-left text-sm text-gray-200">
                <thead className="bg-forest/50 text-xs uppercase text-gray-300 border-b border-glass-border">
                    <tr>
                        <th scope="col" className="px-6 py-4">Mandi Market</th>
                        <th scope="col" className="px-6 py-4">Distance</th>
                        <th scope="col" className="px-6 py-4">Price / Qtl</th>
                        <th scope="col" className="px-6 py-4 font-bold text-mint">Net Realization</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedMandis.map((mandi) => (
                        <tr
                            key={mandi.id}
                            className={`border-b border-glass-border last:border-0 hover:bg-white/5 transition-colors ${mandi.isOptimal ? 'bg-mint/10' : ''}`}
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
